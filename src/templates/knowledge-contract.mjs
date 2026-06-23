function runCmd(pm) {
  if (pm === 'pnpm') return 'pnpm run';
  if (pm === 'yarn') return 'yarn';
  return 'npm run';
}

function skeletonTable(criticalSkeleton) {
  const header = `| Category | Paths | Matching tests |
|----------|-------|----------------|`;
  const rows = criticalSkeleton.map((cat) => {
    const paths = cat.paths.map((p) => `\`${p}\``).join(', ');
    const pattern = cat.testPattern.replace(/^\^/, '');
    return `| \`${cat.category}\` | ${paths} | \`${pattern}\` |`;
  });
  return [header, ...rows].join('\n');
}

export default function knowledgeContractTemplate(config) {
  const repoName = config.repoName;
  const cmd = runCmd(config.packageManager);
  const baseBranch = config.baseBranch;
  const table = skeletonTable(config.criticalSkeleton);

  return `# ${repoName} Knowledge Contract

This document defines how ${repoName} uses contract checks in local development and PR review. The contract verifies that critical skeleton changes include matching tests and a structured impact summary. GitNexus is optional; when unavailable, the contract degrades to classification and summary validation only.

## Local Workflow

Run:

\`\`\`bash
${cmd} agent:bootstrap
${cmd} quality:predev
\`\`\`

\`quality:predev\` installs hooks and runs the local contract check. The contract check classifies changed files and validates the impact summary when critical skeleton surfaces are touched.

## Critical Skeleton

Critical skeleton changes require matching tests and a structured PR impact summary.

${table}

## PR Summary Format

Fill this section in the PR template:

\`\`\`md
## Impact Summary

- Risk level: LOW|MEDIUM|HIGH|CRITICAL
- Critical skeleton changes: explain touched categories or say none
- Impact analysis: mention detect_changes (if GitNexus available) or manual impact conclusion
- Verification: commands run and results, or why unavailable
\`\`\`

Do not use placeholders such as \`-\`, \`none\`, \`n/a\`, \`todo\`, or \`tbd\` for critical skeleton changes.

## CI Contract

\`${cmd} contract:gitnexus\` runs in Contract Guard on PRs to \`${baseBranch}\`. It checks:

- Changed files, including additions, copies, deletions, modifications, renames, type changes, unmerged paths, unknown paths, and broken pairs.
- Whether critical skeleton categories have matching test changes.
- Whether the PR body contains a structured impact summary for critical changes.
- Whether the summary includes \`Risk level\`, \`Critical skeleton changes\`, \`Impact analysis\`, and \`Verification\`.

For non-critical changes, the contract is advisory.

## GitNexus Optional Degradation

The contract scripts preserve the GitNexus invocation structure for future integration. When \`npx gitnexus\` is unavailable, the analyze step is skipped with an advisory warning. Contract classification and impact summary validation continue to run.

## Expected Evidence

Before final review, contributors and agents should be able to state:

- Which critical skeleton categories changed, if any.
- Which direct callers, affected processes, or modules the impact analysis reported.
- Which tests or gates were run.
- Which verification could not run and why.
`;
}
