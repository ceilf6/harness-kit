import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { basename, resolve } from 'node:path';

function readPackageJson(cwd) {
  const pkgPath = resolve(cwd, 'package.json');
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    return null;
  }
}

function detectPackageManager(cwd) {
  if (existsSync(resolve(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function detectBaseBranch() {
  try {
    const output = execFileSync(
      'git',
      ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    const match = output.match(/^origin\/(.+)$/);
    return match ? match[1] : 'main';
  } catch {
    return 'main';
  }
}

function detectRepoUrl(cwd, pkg) {
  if (pkg?.repository?.url) {
    return pkg.repository.url
      .replace(/^git\+/, '')
      .replace(/^git:\/\//, 'https://')
      .replace(/\.git$/, '');
  }
  try {
    const remote = execFileSync('git', ['remote', 'get-url', 'origin'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!remote) return '';
    return remote
      .replace(/^git@([^:]+):/, 'https://$1/')
      .replace(/^git:\/\//, 'https://')
      .replace(/\.git$/, '');
  } catch {
    return '';
  }
}

function hasEslintConfig(cwd) {
  const candidates = [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    '.eslintrc.js',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc',
  ];
  return candidates.some((name) => existsSync(resolve(cwd, name)));
}

function hasHarnessScripts(cwd) {
  return existsSync(resolve(cwd, 'scripts/workflows/contract-rules.mjs'));
}

export async function detect(cwd = process.cwd()) {
  const pkg = readPackageJson(cwd);
  const devDeps = pkg?.devDependencies ?? {};
  const deps = pkg?.dependencies ?? {};

  const packageName = pkg?.name ?? (basename(resolve(cwd)) || 'project');

  return {
    packageManager: detectPackageManager(cwd),
    packageName,
    repoUrl: detectRepoUrl(cwd, pkg),
    baseBranch: detectBaseBranch(),
    hasVitest: Boolean(devDeps.vitest || deps.vitest),
    hasJest: Boolean(devDeps.jest || deps.jest),
    hasEslint: hasEslintConfig(cwd),
    hasHarness: hasHarnessScripts(cwd),
    existingScripts: pkg?.scripts ?? {},
  };
}

export default detect;
