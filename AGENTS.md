# harness-kit - 工程开发提示词

本文件用于指导开发者开发 harness-kit CLI 工具本身。harness-kit 是一个 Harness 工程冷启动脚手架工具，用于快速搭建 OSS Harness 环境。

## Documents

1. `README.md` is the public product overview.
2. `docs/architecture.md` and `docs/design.md` (when created) define architecture and SDD behavior.
3. `CONTRIBUTING.md`, `docs/workflow.md`, and `docs/knowledge-contract.md` define OSS contribution, Harness, and contract rules.
4. Issue or PR text defines the specific change request.
5. Existing code is evidence, but it does not override the documents above.

When documents conflict or expected behavior is unclear, ask the maintainer instead of silently choosing a new architecture.

## 项目概述

harness-kit 是一个 Harness 工程冷启动 CLI 工具，让 OSS 仓库快速搭建本地质量门禁、契约检查、Git 钩子与 GitHub 模板。

- **仓库**: https://github.com/ceilf6/harness-kit
- **维护者**: @ceilf6
- **赛道**: 开发者工具
- **版本**: 0.1.0

## 技术栈

- **运行时**: Node.js (ESM)
- **CLI 交互**: @inquirer/prompts
- **测试**: Vitest + node:test
- **Lint**: ESLint (flat config)
- **包管理**: npm

## 项目结构

```
harness-kit/
├── bin/                     # CLI 入口
│   └── harness-kit.mjs
├── docs/                    # 文档
│   ├── superpowers/         # 设计文档与实施计划
│   │   ├── specs/
│   │   └── plans/
│   ├── workflow.md          # OSS 工作流
│   ├── knowledge-contract.md # 知识契约
│   └── oss-harness-engineering-workflow.md # Harness 操作手册
├── scripts/                 # Harness 脚本
│   ├── workflows/           # 契约与钩子脚本
│   └── tests/               # Harness 测试
├── src/                     # 源码
│   ├── templates/           # 模板引擎（核心 IP）
│   ├── detect.mjs
│   ├── generate.mjs
│   ├── merge.mjs
│   └── prompt.mjs
├── .githooks/               # Git 钩子
├── .github/workflows/       # CI/CD
├── AGENTS.md                # 本文件：工程开发提示词
├── CLAUDE.md                # Claude 开发提示词
├── CONTRIBUTING.md          # 贡献者指南
└── README.md
```

## Work

1. Run `npm run agent:bootstrap` and `npm run quality:predev` before code changes when feasible.
2. Before editing critical skeleton paths, run `npm run contract:check` and report the blast radius.
3. Keep changes focused and independently reviewable.
4. Run focused tests for the touched area, then broader gates as risk increases.
5. Before final review, run `npm run quality:precommit` at minimum.
6. For critical skeleton changes, fill the PR Impact Summary with concrete results.

## Harness Loop

For non-trivial repository changes, use this loop:

1. Start from an Issue, Discussion, or maintainer-approved task description.
2. Create a short-lived branch from `main` using `feat/`, `fix/`, `docs/`, or `chore/`.
3. Run `npm run agent:bootstrap` and `npm run quality:predev`.
4. Implement the smallest reviewable change with focused tests.
5. Run `npm run quality:local` before pushing when feasible.
6. Open a PR to `main` with the PR template filled in, including the Impact Summary for critical skeleton changes.
7. Wait for CI, Contract Guard, Repo Guard CR, and maintainer review comments.
8. Address actionable review comments with follow-up commits, then rerun the relevant gates.
9. Let maintainers decide merge readiness; do not add comment-triggered auto-merge behavior.

## TDD And SDD

- **TDD**: Bug fixes and new features are encouraged to follow red-green-refactor. Write a failing test first, implement the minimal code to pass, then refactor. Test files live next to source as `*.test.mjs`.
- **SDD**: Non-trivial changes (new features, architecture adjustments, critical skeleton changes) must first produce a design doc under `docs/superpowers/specs/` and an implementation plan under `docs/superpowers/plans/`. Trivial changes may skip this cycle.

## OSS Scope

harness-kit uses an open-source maintainer workflow. Do not add training-camp claim comments, score labels, progress ledgers, timeout-close automation, or comment-triggered auto-merge rules unless maintainers explicitly request a separate workflow.
