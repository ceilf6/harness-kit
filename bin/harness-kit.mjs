#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { detect } from '../src/detect.mjs';
import { prompt, buildDefaultConfig } from '../src/prompt.mjs';
import { generate } from '../src/generate.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getVersion() {
  const pkgPath = resolve(__dirname, '..', 'package.json');
  return JSON.parse(readFileSync(pkgPath, 'utf8')).version;
}

const HELP = `harness-kit - Scaffold OSS Harness environments

Usage:
  harness-kit init [options]    Initialize Harness in the current directory
  harness-kit --version         Print version
  harness-kit --help            Print this help

Options for init:
  --yes, -y     Use all detected defaults, skip prompts
  --force, -f   Overwrite existing files
  --help, -h    Show init help

Examples:
  harness-kit init
  harness-kit init --yes
  harness-kit init --yes --force
`;

const INIT_HELP = `harness-kit init - Initialize Harness in the current directory

Usage:
  harness-kit init [options]

Options:
  --yes, -y     Use all detected defaults, skip prompts
  --force, -f   Overwrite existing files
  --help, -h    Show this help

The init flow:
  1. Detect repository properties (package manager, base branch, etc.)
  2. Prompt for remaining config (skipped with --yes)
  3. Generate contract scripts, githooks, templates, and docs
  4. Merge Harness scripts into package.json
  5. Optionally install dependencies

Existing files are skipped unless --force is given. AGENTS.md and CLAUDE.md
are appended to (not overwritten) when they already exist.
`;

function runInstall(packageManager, cwd) {
  const cmd = packageManager === 'yarn' ? 'yarn' : packageManager === 'pnpm' ? 'pnpm' : 'npm';
  const args = ['install'];
  console.log(`\nRunning ${cmd} ${args.join(' ')}...`);
  const result = spawnSync(cmd, args, { stdio: 'inherit', cwd });
  if (result.status !== 0) {
    console.warn(
      `warning: dependency install exited with code ${result.status}. ` +
        'You may need to run it manually (e.g. after `git init`).',
    );
  }
}

async function runInit(args) {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(INIT_HELP);
    return;
  }

  const yes = args.includes('--yes') || args.includes('-y');
  const force = args.includes('--force') || args.includes('-f');
  const cwd = process.cwd();

  console.log('Detecting repository properties...');
  const detected = await detect(cwd);
  console.log(
    `  packageManager=${detected.packageManager}  baseBranch=${detected.baseBranch}` +
      (detected.repoUrl ? `  repoUrl=${detected.repoUrl}` : ''),
  );

  let config;
  if (yes) {
    console.log('Using detected defaults (--yes).');
    config = buildDefaultConfig(detected);
  } else {
    config = await prompt(detected);
  }

  console.log('\nGenerating Harness files...');
  const { created, skipped } = await generate(config, { force, cwd });

  if (config.installDeps) {
    runInstall(config.packageManager, cwd);
  }

  console.log(`\nDone. ${created.length} created, ${skipped.length} skipped.`);
  if (skipped.length) {
    console.log('Skipped files (use --force to overwrite):');
    for (const path of skipped) console.log(`  ${path}`);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(HELP);
    return;
  }

  const command = args[0];

  if (command === '--version' || command === '-v') {
    console.log(getVersion());
    return;
  }

  if (command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  if (command === 'init') {
    try {
      await runInit(args.slice(1));
    } catch (err) {
      console.error(`\nerror: ${err instanceof Error ? err.message : String(err)}`);
      process.exitCode = 1;
    }
    return;
  }

  console.error(`Unknown command: ${command}\n`);
  console.error(HELP);
  process.exitCode = 1;
}

main();
