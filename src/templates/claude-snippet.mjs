function runCmd(pm) {
  if (pm === 'pnpm') return 'pnpm run';
  if (pm === 'yarn') return 'yarn';
  return 'npm run';
}

export default function claudeSnippetTemplate(config) {
  const cmd = runCmd(config.packageManager);
  const baseBranch = config.baseBranch;
  const repoName = config.repoName;
  const sdd = config.sdd
    ? `- **SDD**: Non-trivial changes (new features, architecture adjustments, critical skeleton changes) must first produce a design doc under \`docs/superpowers/specs/\` and an implementation plan under \`docs/superpowers/plans/\`. Trivial changes may skip this cycle.`
    : '';

  return `## Documents

1. \`README.md\` is the public product overview.
2. \`docs/architecture.md\` and \`docs/design.md\` (when created) define architecture and SDD behavior.
3. \`CONTRIBUTING.md\`, \`docs/workflow.md\`, and \`docs/knowledge-contract.md\` define OSS contribution, Harness, and contract rules.
4. Issue or PR text defines the specific change request.
5. Existing code is evidence, but it does not override the documents above.

When documents conflict or expected behavior is unclear, ask the maintainer instead of silently choosing a new architecture.

## Work

1. Run \`${cmd} agent:bootstrap\` and \`${cmd} quality:predev\` before code changes when feasible.
2. Before editing critical skeleton paths, run \`${cmd} contract:check\` and report the blast radius.
3. Keep changes focused and independently reviewable.
4. Run focused tests for the touched area, then broader gates as risk increases.
5. Before final review, run \`${cmd} quality:precommit\` at minimum.
6. For critical skeleton changes, fill the PR Impact Summary with concrete results.

## Harness Loop

For non-trivial repository changes, use this loop:

1. Start from an Issue, Discussion, or maintainer-approved task description.
2. Create a short-lived branch from \`${baseBranch}\` using \`feat/\`, \`fix/\`, \`docs/\`, or \`chore/\`.
3. Run \`${cmd} agent:bootstrap\` and \`${cmd} quality:predev\`.
4. Implement the smallest reviewable change with focused tests.
5. Run \`${cmd} quality:local\` before pushing when feasible.
6. Open a PR to \`${baseBranch}\` with the PR template filled in, including the Impact Summary for critical skeleton changes.
7. Wait for CI, Contract Guard, Repo Guard CR, and maintainer review comments.
8. Address actionable review comments with follow-up commits, then rerun the relevant gates.
9. Let maintainers decide merge readiness; do not add comment-triggered auto-merge behavior.

## TDD And SDD

- **TDD**: Bug fixes and new features are encouraged to follow red-green-refactor. Write a failing test first, implement the minimal code to pass, then refactor. Test files live next to source as \`*.test.tsx\` / \`*.test.ts\`.
${sdd}

## OSS Scope

${repoName} uses an open-source maintainer workflow. Do not add training-camp claim comments, score labels, progress ledgers, timeout-close automation, or comment-triggered auto-merge rules unless maintainers explicitly request a separate workflow.
`;
}
