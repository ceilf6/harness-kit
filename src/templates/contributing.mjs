function installCmd(pm) {
  if (pm === 'pnpm') return 'pnpm install';
  if (pm === 'yarn') return 'yarn install';
  return 'npm install';
}

function runCmd(pm) {
  if (pm === 'pnpm') return 'pnpm run';
  if (pm === 'yarn') return 'yarn';
  return 'npm run';
}

function tddLine(tddFramework) {
  const runner =
    tddFramework === 'vitest'
      ? 'and run with `vitest`'
      : tddFramework === 'jest'
        ? 'and run with `jest`'
        : 'and run with your project test runner';
  return `- **TDD**: Bug fixes and new features are encouraged to follow red-green-refactor. Write a failing test first, implement the minimal code to pass, then refactor. Test files live next to source as \`*.test.tsx\` / \`*.test.ts\` ${runner}.`;
}

export default function contributingTemplate(config) {
  const repoName = config.repoName;
  const install = installCmd(config.packageManager);
  const cmd = runCmd(config.packageManager);
  const tdd = tddLine(config.tddFramework);
  const sdd = config.sdd
    ? `- **SDD**: Non-trivial changes (new features, architecture adjustments, critical skeleton changes) should first produce a design doc under \`docs/superpowers/specs/\` and an implementation plan under \`docs/superpowers/plans/\`. Trivial changes may skip this cycle.`
    : '';

  return `# Contributing To ${repoName}

Thanks for helping improve ${repoName}. This repository uses a lightweight OSS Harness: local quality gates, contract checks, CI, Repo Guard advisory review, and maintainer review. It does not use training-camp claim, score, progress-ledger, timeout-close, or auto-merge commands.

## Setup

\`\`\`bash
${install}
${cmd} agent:bootstrap
${cmd} quality:predev
\`\`\`

\`${cmd} agent:bootstrap\` installs repository git hooks and prints the expected local workflow. \`${cmd} quality:predev\` refreshes contract context before development.

## Local Quality Gates

- \`${cmd} quality:precommit\`: fast gate for commit-time checks. Runs lint, build, test, and workflow tests.
- \`${cmd} quality:ci\`: CI-equivalent gate. Runs lint, build, test, and workflow tests.
- \`${cmd} quality:local\`: full local gate for push-time checks. Runs contract checks and \`quality:ci\`.

The repository hooks run \`quality:precommit\` on commit and \`quality:local\` on push. If hooks are unavailable, run the same commands manually. Maintainers may use \`SKIP_QUALITY_HOOKS=1\` for emergencies, but CI remains authoritative.

## Branches And PRs

Open PRs against \`${config.baseBranch}\`. Use short-lived branches such as:

\`\`\`text
feat/<topic>
fix/<topic>
docs/<topic>
\`\`\`

Keep each PR focused on one behavior, fix, or maintenance task.

## Impact Summary

Critical skeleton changes require a concrete Impact Summary in the PR template. Run the contract check before changing shared surfaces and before final review:

\`\`\`bash
${cmd} contract:check
\`\`\`

Fill the PR Impact Summary section like this:

\`\`\`md
- Risk level: LOW
- Critical skeleton changes: AGENTS.md only; no public API changes.
- Impact analysis: manual review of prompt references; no runtime behavior change.
- Verification: ${cmd} quality:precommit passed.
\`\`\`

Do not leave placeholder values for critical skeleton changes.

## TDD And SDD

${tdd}
${sdd}

## Documentation Authority

Use this priority when documents and code disagree:

1. \`README.md\` for public product positioning.
2. \`docs/architecture.md\` and \`docs/design.md\` (when created) for architecture and SDD behavior.
3. \`docs/workflow.md\` and \`docs/knowledge-contract.md\` for contribution and Harness rules.
4. Issue or PR text for the specific change.
5. Existing code, unless it contradicts the documents above.

If the documents conflict, ask maintainers instead of silently choosing a new architecture.

## Security

Do not paste secrets into issues, PRs, tests, or screenshots. Workflows for fork PRs must not execute untrusted code with write tokens. Repo Guard is advisory; maintainers still decide merges.
`;
}
