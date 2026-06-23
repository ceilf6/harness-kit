function runCommand(packageManager) {
  if (packageManager === 'pnpm') return 'pnpm run';
  if (packageManager === 'yarn') return 'yarn';
  return 'npm run';
}

export default function hooksTemplate(config) {
  const cmd = runCommand(config.packageManager);
  const preCommit = `#!/bin/sh
set -eu

if [ "\${SKIP_QUALITY_HOOKS:-}" = "1" ]; then
  echo "Skipping pre-commit quality gate because SKIP_QUALITY_HOOKS=1. CI remains authoritative."
  exit 0
fi

${cmd} quality:precommit
`;

  const prePush = `#!/bin/sh
set -eu

if [ "\${SKIP_QUALITY_HOOKS:-}" = "1" ]; then
  echo "Skipping pre-push quality gate because SKIP_QUALITY_HOOKS=1. CI remains authoritative."
  exit 0
fi

${cmd} quality:local
`;

  return { preCommit, prePush };
}
