function runCommand(packageManager) {
  if (packageManager === 'pnpm') return 'pnpm run';
  if (packageManager === 'yarn') return 'yarn';
  return 'npm run';
}

export default function prTemplateTemplate(config) {
  const cmd = runCommand(config.packageManager);
  const sddChecklist = config.sdd
    ? `- [ ] For non-trivial changes, I have written a design doc under \`docs/superpowers/specs/\`.`
    : '';
  return `## Linked Issue Or Context

-

## Summary

-

## Impact Scope

-

## Impact Summary

- Risk level: -
- Critical skeleton changes: -
- Impact analysis: -
- Verification: -

## Verification

-

## Checklist

- [ ] I have linked an issue or explained why this PR stands alone.
- [ ] I have kept the diff focused on the stated change.
- [ ] I have run \`${cmd} quality:precommit\`, or explained why it could not run.
- [ ] I have run \`${cmd} quality:local\` for critical skeleton changes, or explained why it could not run.
- [ ] I have updated docs or tests when behavior, public APIs, or Harness contracts changed.
- [ ] For critical skeleton changes, I have filled the Impact Summary with concrete results.
${sddChecklist}
`;
}
