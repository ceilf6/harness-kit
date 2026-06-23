import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  appendFileSync,
} from 'node:fs';
import { resolve, dirname } from 'node:path';
import templates from './templates/index.mjs';
import mergePackageJson from './merge.mjs';

const SPECIAL_FILES = new Set(['AGENTS.md', 'CLAUDE.md']);

export async function generate(config, options = {}) {
  const force = options.force ?? false;
  const cwd = options.cwd ?? process.cwd();
  const created = [];
  const skipped = [];

  for (const { path, generate } of templates) {
    if (SPECIAL_FILES.has(path)) continue;

    const fullPath = resolve(cwd, path);
    if (existsSync(fullPath) && !force) {
      console.log(`skip  ${path}`);
      skipped.push(path);
      continue;
    }

    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, generate(config), 'utf8');
    console.log(`create  ${path}`);
    created.push(path);
  }

  for (const { path, generate } of templates) {
    if (!SPECIAL_FILES.has(path)) continue;

    const fullPath = resolve(cwd, path);
    const snippet = generate(config);

    if (!existsSync(fullPath)) {
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, snippet, 'utf8');
      console.log(`create  ${path}`);
      created.push(path);
      continue;
    }

    if (force) {
      writeFileSync(fullPath, snippet, 'utf8');
      console.log(`create  ${path}`);
      created.push(path);
      continue;
    }

    const existing = readFileSync(fullPath, 'utf8');
    if (existing.includes(snippet)) {
      console.log(`skip  ${path}`);
      skipped.push(path);
    } else {
      const prefix = existing.endsWith('\n') ? '\n' : '\n\n';
      appendFileSync(fullPath, `${prefix}${snippet}`, 'utf8');
      console.log(`update  ${path}`);
      created.push(path);
    }
  }

  await mergePackageJson(config, cwd);
  created.push('package.json');

  return { created, skipped };
}

export default generate;
