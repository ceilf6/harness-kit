function runCommand(packageManager) {
  if (packageManager === 'pnpm') return 'pnpm run';
  if (packageManager === 'yarn') return 'yarn';
  return 'npm run';
}

function sampleFile(cat) {
  const first = cat.paths[0];
  if (first.endsWith('/')) return first + 'sample.txt';
  return first;
}

function buildClassifyTests(config) {
  return config.criticalSkeleton
    .map((cat) => {
      const file = JSON.stringify(sampleFile(cat));
      return `test('classifyContractPaths marks ${cat.category} files as critical', () => {
  const { critical } = classifyContractPaths([${file}]);
  assert.equal(critical.length, 1);
  assert.equal(critical[0].category, '${cat.category}');
});`;
    })
    .join('\n\n');
}

export default function workflowTestTemplate(config) {
  const cmd = runCommand(config.packageManager);
  const classifyTests = buildClassifyTests(config);
  const maintainer = config.maintainer;
  const baseBranch = config.baseBranch;

  return `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  classifyContractPaths,
  evaluateGitNexusContract,
  extractImpactSummary,
  validateStructuredImpactSummary,
} from '../workflows/contract-rules.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');

function readRootFile(relativePath) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function packageJson() {
  return JSON.parse(readRootFile('package.json'));
}

${classifyTests}

test('evaluateGitNexusContract passes for non-critical changes', () => {
  const result = evaluateGitNexusContract({
    changedFiles: ['src/App.tsx'],
    impactSummary: '',
    requireImpactSummary: false,
  });
  assert.equal(result.ok, true);
});

test('evaluateGitNexusContract fails for critical changes without impact summary', () => {
  const result = evaluateGitNexusContract({
    changedFiles: ['AGENTS.md'],
    impactSummary: '',
    requireImpactSummary: true,
  });
  assert.equal(result.ok, false);
});

test('evaluateGitNexusContract fails for placeholder impact summary', () => {
  const result = evaluateGitNexusContract({
    changedFiles: ['.github/workflows/ci.yml'],
    impactSummary: '-',
    requireImpactSummary: true,
  });
  assert.equal(result.ok, false);
});

test('evaluateGitNexusContract passes for critical changes with valid summary', () => {
  const summary = [
    '- Risk level: LOW',
    '- Critical skeleton changes: AGENTS.md only',
    '- Impact analysis: manual review, no public API change',
    '- Verification: ${cmd} quality:precommit passed',
  ].join('\\n');
  const result = evaluateGitNexusContract({
    changedFiles: ['AGENTS.md', 'scripts/tests/workflow-rules.test.mjs'],
    impactSummary: summary,
    requireImpactSummary: true,
  });
  assert.equal(result.ok, true);
});

test('validateStructuredImpactSummary rejects invalid risk level', () => {
  const summary = [
    '- Risk level: URGENT',
    '- Critical skeleton changes: none',
    '- Impact analysis: manual review',
    '- Verification: tests passed',
  ].join('\\n');
  const reasons = validateStructuredImpactSummary(summary);
  assert.ok(reasons.some((r) => r.includes('Invalid risk level')));
});

test('extractImpactSummary pulls section under heading', () => {
  const text = [
    '## Summary',
    'some text',
    '',
    '## Impact Summary',
    '- Risk level: LOW',
    '- Critical skeleton changes: none',
    '',
    '## Verification',
    'other',
  ].join('\\n');
  const summary = extractImpactSummary(text);
  assert.ok(summary.includes('Risk level: LOW'));
  assert.ok(!summary.includes('other'));
});

test('pre-commit hook exists and references quality:precommit', () => {
  const content = readRootFile('.githooks/pre-commit');
  assert.ok(content.includes('${cmd} quality:precommit'));
  assert.ok(content.includes('SKIP_QUALITY_HOOKS'));
});

test('pre-push hook exists and references quality:local', () => {
  const content = readRootFile('.githooks/pre-push');
  assert.ok(content.includes('${cmd} quality:local'));
  assert.ok(content.includes('SKIP_QUALITY_HOOKS'));
});

test('package.json contains required Harness scripts', () => {
  const scripts = packageJson().scripts;
  const required = [
    'prepare',
    'hooks:install',
    'agent:bootstrap',
    'contract:local',
    'contract:check',
    'contract:gitnexus',
    'quality:predev',
    'test',
    'test:workflows',
    'quality:precommit',
    'quality:ci',
    'quality:local',
  ];
  for (const name of required) {
    assert.ok(scripts[name], \`missing script: \${name}\`);
  }
});

test('PR template contains Impact Summary section', () => {
  const content = readRootFile('.github/PULL_REQUEST_TEMPLATE.md');
  assert.ok(content.includes('## Impact Summary'));
  assert.ok(content.includes('Risk level'));
  assert.ok(content.includes('Critical skeleton changes'));
  assert.ok(content.includes('Impact analysis'));
  assert.ok(content.includes('Verification'));
});

test('issue templates exist', () => {
  assert.ok(existsSync(resolve(root, '.github/ISSUE_TEMPLATE/bug.yml')));
  assert.ok(existsSync(resolve(root, '.github/ISSUE_TEMPLATE/feature.yml')));
  assert.ok(existsSync(resolve(root, '.github/ISSUE_TEMPLATE/maintenance.yml')));
  assert.ok(existsSync(resolve(root, '.github/ISSUE_TEMPLATE/config.yml')));
});

test('CODEOWNERS exists and references ${maintainer}', () => {
  const content = readRootFile('.github/CODEOWNERS');
  assert.ok(content.includes('${maintainer}'));
});

test('contract-guard.yml targets ${baseBranch} and calls contract:gitnexus', () => {
  const content = readRootFile('.github/workflows/contract-guard.yml');
  assert.ok(content.includes('branches: [${baseBranch}]'));
  assert.ok(content.includes('${cmd} contract:gitnexus'));
});

test('CONTRIBUTING.md exists', () => {
  assert.ok(existsSync(resolve(root, 'CONTRIBUTING.md')));
});

test('docs/workflow.md exists', () => {
  assert.ok(existsSync(resolve(root, 'docs/workflow.md')));
});

test('docs/knowledge-contract.md exists', () => {
  assert.ok(existsSync(resolve(root, 'docs/knowledge-contract.md')));
});
`;
}
