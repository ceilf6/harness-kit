import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function runPrefix(packageManager) {
  if (packageManager === 'pnpm') return 'pnpm run';
  if (packageManager === 'yarn') return 'yarn';
  return 'npm run';
}

function buildHarnessScripts(config, existingScripts) {
  const run = runPrefix(config.packageManager);
  const hasBuild = Boolean(existingScripts?.build);
  const hasLint = Boolean(existingScripts?.lint);
  const tdd = config.tddFramework;

  const scripts = {
    prepare: `${run} hooks:install`,
    'hooks:install': 'node scripts/workflows/install-hooks.mjs',
    'agent:bootstrap': 'node scripts/workflows/contract-check.mjs bootstrap',
    'contract:local': 'node scripts/workflows/contract-check.mjs local',
    'contract:check': 'node scripts/workflows/contract-check.mjs check',
    'contract:gitnexus': 'node scripts/workflows/contract-check.mjs gitnexus',
    'quality:predev': `${run} hooks:install && ${run} contract:local`,
    'test:workflows': 'node --test scripts/tests/*.test.mjs',
    'quality:local': `${run} contract:local && ${run} quality:ci`,
  };

  if (!hasLint) {
    scripts.lint = 'eslint .';
  }

  const buildStep = hasBuild ? `${run} build && ` : '';
  const testStep = tdd !== 'none' ? `${run} test && ` : '';

  if (tdd !== 'none') {
    const testRun = tdd === 'jest' ? 'jest' : 'vitest run';
    const testWatch = tdd === 'jest' ? 'jest --watch' : 'vitest';
    scripts.test = testRun;
    scripts['test:watch'] = testWatch;
  }

  scripts['quality:precommit'] = `${run} lint && ${buildStep}${testStep}${run} test:workflows`;
  scripts['quality:ci'] = `${run} lint && ${buildStep}${testStep}${run} test:workflows`;

  return scripts;
}

function depPresent(pkg, name) {
  return Boolean(pkg?.dependencies?.[name] || pkg?.devDependencies?.[name]);
}

function buildDevDependencies(config, pkg) {
  const devDeps = { ...(pkg?.devDependencies ?? {}) };

  if (config.tddFramework === 'vitest' && !depPresent(pkg, 'vitest')) {
    devDeps.vitest = '^2.1.0';
  }

  const eslintDeps = {
    eslint: '^9.0.0',
    '@eslint/js': '^9.0.0',
    'typescript-eslint': '^8.0.0',
    'eslint-plugin-react-hooks': '^5.0.0',
    globals: '^15.0.0',
  };
  for (const [name, version] of Object.entries(eslintDeps)) {
    if (!depPresent(pkg, name)) {
      devDeps[name] = version;
    }
  }

  return devDeps;
}

export async function mergePackageJson(config, cwd) {
  const pkgPath = resolve(cwd, 'package.json');
  let pkg = {};
  if (existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    } catch {
      pkg = {};
    }
  }

  const existingScripts = pkg.scripts ?? {};
  const harnessScripts = buildHarnessScripts(config, existingScripts);

  const mergedScripts = { ...existingScripts };
  for (const [key, value] of Object.entries(harnessScripts)) {
    mergedScripts[key] = value;
  }

  pkg.scripts = mergedScripts;
  pkg.devDependencies = buildDevDependencies(config, pkg);

  if (!pkg.type) pkg.type = 'module';

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  console.log('update  package.json');

  return pkg;
}

export default mergePackageJson;
