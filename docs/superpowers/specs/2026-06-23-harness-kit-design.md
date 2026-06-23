# harness-kit Design

Date: 2026-06-23
Repository: `harness-kit`
Purpose: Harness engineering cold-start CLI tool for quickly scaffolding OSS Harness environments in any repository.

## Goal

A Node.js CLI tool (`npx harness-kit init`) that auto-detects target repo properties, interactively prompts for remaining config, and generates a full Harness environment adapted from the FrontAgent-app / StudyAgent pattern: contract scripts, githooks, PR/Issue templates, CODEOWNERS, contract-guard CI, OSS docs, engineering prompt updates, and TDD/SDD config.

## Config Shape

```js
{
  repoName,           // "ceilf6/KnowledgeFlow-StudyAgent"
  repoUrl,            // "https://github.com/ceilf6/KnowledgeFlow-StudyAgent"
  maintainer,         // "@ceilf6"
  packageManager,     // "npm" | "pnpm" | "yarn"
  baseBranch,         // "main"
  criticalSkeleton,   // [{ category, paths, testPattern, label }]
  gitnexus,           // true (optional degradation)
  tddFramework,       // "vitest" | "jest" | "none"
  sdd,                // true
  installDeps,        // true
  discussionsUrl,     // derived from repoUrl
  packageName,        // from package.json
}
```

## Architecture

- `bin/harness-kit.mjs` — CLI entry, parses argv, dispatches init
- `src/detect.mjs` — auto-detect package manager, base branch, existing configs
- `src/prompt.mjs` — interactive prompts via @inquirer/prompts
- `src/generate.mjs` — orchestrates file generation from templates
- `src/merge.mjs` — merges package.json scripts without overwriting
- `src/templates/*.mjs` — 18 template functions `(config) => string`
- Self-bootstrapped: harness-kit uses its own Harness pattern

## Critical Skeleton Categories

Default (always): `repo-harness`
Optional: `agent-prompts` (docs/agent-prompts/), `src-app` (src/)
Custom: user-defined via config

## Templates

Each template is a pure function `(config) => string`. The `contract-rules` template generates the `criticalContractRules` array from `config.criticalSkeleton`. All other templates substitute `packageManager`, `baseBranch`, `maintainer`, `repoName`, etc.

## Idempotency

Existing files are skipped (printed as `skip`). `--force` overwrites. `package.json` scripts are merged (existing keys preserved).

## Self-Bootstrap

harness-kit itself uses the Harness: .githooks/, scripts/workflows/, scripts/tests/, .github/*, docs/*, AGENTS.md, CLAUDE.md, CONTRIBUTING.md. Critical skeleton: `repo-harness` + `template-engine` (src/templates/).

## npm Publishing

- `bin`: `{ "harness-kit": "bin/harness-kit.mjs" }`
- `files`: `["bin/", "src/", "README.md"]`
- `prepare`: installs own hooks
- `prepublishOnly`: runs quality:ci
