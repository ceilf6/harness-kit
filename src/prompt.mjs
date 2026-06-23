import { input, select, confirm, checkbox } from '@inquirer/prompts';

const REPO_HARNESS_CATEGORY = {
  category: 'repo-harness',
  paths: [
    '.github/workflows/',
    '.github/ISSUE_TEMPLATE/',
    '.github/PULL_REQUEST_TEMPLATE.md',
    '.github/CODEOWNERS',
    '.githooks/',
    'scripts/workflows/',
    'AGENTS.md',
    'CLAUDE.md',
    'CONTRIBUTING.md',
    'docs/workflow.md',
    'docs/knowledge-contract.md',
    'README.md',
  ],
  testPattern: '^scripts/tests/',
};

const EXTRA_CATEGORIES = {
  'agent-prompts': {
    category: 'agent-prompts',
    paths: ['docs/agent-prompts/'],
    testPattern: '^scripts/tests/',
  },
  'src-app': {
    category: 'src-app',
    paths: ['src/'],
    testPattern: '^scripts/tests/',
  },
};

function repoNameFromUrl(url) {
  if (!url) return '';
  const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
  return match ? match[1] : '';
}

function repoUrlFromName(repoName) {
  if (!repoName) return '';
  if (/^https?:\/\//.test(repoName)) return repoName.replace(/\.git$/, '');
  return `https://github.com/${repoName.replace(/^\/+|\/+$/g, '')}`;
}

function discussionsUrlFromRepoUrl(repoUrl) {
  if (!repoUrl) return '';
  return `${repoUrl.replace(/\/$/, '')}/discussions`;
}

function defaultTddFramework(detected) {
  if (detected.hasVitest) return 'vitest';
  if (detected.hasJest) return 'jest';
  return 'none';
}

function assembleConfig(detected, answers) {
  const repoUrl = repoUrlFromName(answers.repoName);
  const discussionsUrl = discussionsUrlFromRepoUrl(repoUrl);
  const criticalSkeleton = [
    REPO_HARNESS_CATEGORY,
    ...answers.extraCategories.map((key) => EXTRA_CATEGORIES[key]),
  ];

  return {
    repoName: answers.repoName || detected.packageName,
    repoUrl,
    maintainer: answers.maintainer,
    packageManager: answers.packageManager,
    baseBranch: answers.baseBranch,
    criticalSkeleton,
    gitnexus: answers.gitnexus,
    tddFramework: answers.tddFramework,
    sdd: answers.sdd,
    installDeps: answers.installDeps,
    discussionsUrl,
    packageName: detected.packageName,
  };
}

export async function prompt(detected) {
  const detectedRepoName = repoNameFromUrl(detected.repoUrl);

  const answers = {
    repoName: await input({
      message: 'Repo name (e.g. "ceilf6/KnowledgeFlow-StudyAgent")',
      default: detectedRepoName || '',
    }),
    maintainer: await input({
      message: 'Maintainer handle (e.g. "@ceilf6")',
      default: '@ceilf6',
    }),
    baseBranch: await input({
      message: 'Base branch',
      default: detected.baseBranch,
    }),
    packageManager: await select({
      message: 'Package manager',
      default: detected.packageManager,
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
      ],
    }),
    extraCategories: await checkbox({
      message: 'Additional critical skeleton categories (repo-harness is always included)',
      choices: [
        { name: 'agent-prompts (docs/agent-prompts/)', value: 'agent-prompts' },
        { name: 'src-app (src/)', value: 'src-app' },
      ],
    }),
    gitnexus: await confirm({
      message: 'Include GitNexus structure (optional degradation)',
      default: true,
    }),
    tddFramework: await select({
      message: 'TDD framework',
      default: defaultTddFramework(detected),
      choices: [
        { name: 'vitest', value: 'vitest' },
        { name: 'jest', value: 'jest' },
        { name: 'none', value: 'none' },
      ],
    }),
    sdd: await confirm({
      message: 'Include SDD discipline',
      default: true,
    }),
    installDeps: await confirm({
      message: 'Install dependencies after generation',
      default: true,
    }),
  };

  return assembleConfig(detected, answers);
}

export function buildDefaultConfig(detected) {
  return assembleConfig(detected, {
    repoName: repoNameFromUrl(detected.repoUrl) || detected.packageName,
    maintainer: '@ceilf6',
    baseBranch: detected.baseBranch,
    packageManager: detected.packageManager,
    extraCategories: [],
    gitnexus: true,
    tddFramework: detected.hasVitest ? 'vitest' : (detected.hasJest ? 'jest' : 'vitest'),
    sdd: true,
    installDeps: true,
  });
}

export default prompt;
