# harness-kit

A Harness engineering cold-start CLI tool for quickly scaffolding OSS Harness environments. Generate local quality gates, contract checks, git hooks, and GitHub templates in seconds.

harness-kit dogfoods its own pattern — this repository is itself bootstrapped with the same Harness files it generates.

## Quick Start

```bash
npx harness-kit init
```

The interactive prompt walks you through repository config and writes Harness files into your project.

## What It Generates

- **Git hooks** (`.githooks/pre-commit`, `.githooks/pre-push`) — local quality gates wired via `core.hooksPath`.
- **Contract scripts** (`scripts/workflows/`) — `contract-rules.mjs`, `contract-check.mjs`, `install-hooks.mjs` for classifying critical skeleton changes and validating impact summaries.
- **Workflow tests** (`scripts/tests/workflow-rules.test.mjs`) — structural tests run with `node --test`.
- **GitHub templates** — PR template with Impact Summary, issue templates (bug, feature, maintenance), CODEOWNERS, and Contract Guard workflow.
- **Docs** — `CONTRIBUTING.md`, `docs/workflow.md`, `docs/knowledge-contract.md`, `docs/oss-harness-engineering-workflow.md`.
- **Agent prompts** — `AGENTS.md` and `CLAUDE.md` engineering guidance.
- **Config** — `eslint.config.js` and `vitest.config.ts`.
- **package.json scripts** — `prepare`, `hooks:install`, `agent:bootstrap`, `contract:local`, `contract:check`, `contract:gitnexus`, `quality:predev`, `test`, `test:workflows`, `quality:precommit`, `quality:ci`, `quality:local`.

## Config Options

| Option | Description | Example |
|--------|-------------|---------|
| `repoName` | GitHub owner/repo | `ceilf6/harness-kit` |
| `repoUrl` | Repository URL | `https://github.com/ceilf6/harness-kit` |
| `maintainer` | CODEOWNERS handle | `@ceilf6` |
| `packageManager` | Package manager | `npm` |
| `baseBranch` | Protected branch | `main` |
| `criticalSkeleton` | Critical categories | `repo-harness`, `template-engine` |
| `gitnexus` | Enable GitNexus integration | `true` |
| `tddFramework` | Test framework | `vitest` |
| `sdd` | Spec-driven development | `true` |
| `discussionsUrl` | GitHub Discussions URL | `https://github.com/ceilf6/harness-kit/discussions` |

## Self-Bootstrap

harness-kit uses its own Harness files. The critical skeleton has two categories:

- **`repo-harness`** — `.github/`, `.githooks/`, `scripts/workflows/`, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `docs/workflow.md`, `docs/knowledge-contract.md`, `README.md`.
- **`template-engine`** — `src/templates/` (the core IP).

Both require matching tests under `scripts/tests/` and a structured Impact Summary for PRs.

## Friendly Links

- [Linux.do](https://linux.do/) - Chinese AI learning and developer community.
- [Aionui](https://github.com/iOfficeAI/AionUi) - Mobile remote-control UI for letting AI agents operate tasks from a phone.
- [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI) - Office suite designed for AI agents.
- [deepseek-pp](https://github.com/zhu1090093659/deepseek-pp) - Browser extension for DeepSeek web conversations.
- [MuseAI](https://github.com/yejiming/MuseAI) - Local AI companion, text adventure, and interactive fiction app.
- [RedBox](https://github.com/Jamailar/RedBox) - Local AI creation workspace for Xiaohongshu creators.
- [1flowbase](https://github.com/taichuy/1flowbase) - Virtual model gateway for publishing multi-model workflows as OpenAI/Claude-compatible endpoints, with trace, token, latency, and cost visibility.

## License

MIT
