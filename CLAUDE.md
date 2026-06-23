# harness-kit - Claude 开发提示词

本文件用于指导 Claude 协助开发 harness-kit CLI 工具。

## Documents

1. `README.md` is the public product overview.
2. `docs/architecture.md` and `docs/design.md` (when created) define architecture and SDD behavior.
3. `CONTRIBUTING.md`, `docs/workflow.md`, and `docs/knowledge-contract.md` define OSS contribution, Harness, and contract rules.
4. Issue or PR text defines the specific change request.
5. Existing code is evidence, but it does not override the documents above.

When documents conflict or expected behavior is unclear, ask the maintainer instead of silently choosing a new architecture.

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

## 项目信息

- **项目名称**: harness-kit
- **口号**: Harness 工程冷启动 CLI，让 OSS 仓库快速搭建质量门禁与契约检查
- **仓库**: https://github.com/ceilf6/harness-kit
- **维护者**: @ceilf6

## 技术栈

- 运行时: Node.js (ESM)
- CLI 交互: @inquirer/prompts
- 测试: Vitest + node:test
- Lint: ESLint (flat config)
- 包管理: npm

## 开发指引

1. 遵循 [AGENTS.md](AGENTS.md) 中的工程开发规则。
2. 源码放在 `src/` 目录，CLI 入口在 `bin/harness-kit.mjs`。
3. 模板引擎位于 `src/templates/`，是 harness-kit 的核心 IP，修改时需格外谨慎并填写 Impact Summary。
4. 所有 `.mjs` 文件使用 ESM。
5. 设计文档位于 `docs/superpowers/specs/`，实施计划位于 `docs/superpowers/plans/`。
