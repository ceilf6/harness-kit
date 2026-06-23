function installCommand(packageManager) {
  if (packageManager === 'pnpm') return 'pnpm install --frozen-lockfile';
  if (packageManager === 'yarn') return 'yarn install --frozen-lockfile';
  return 'npm ci';
}

function runCommand(packageManager) {
  if (packageManager === 'pnpm') return 'pnpm run';
  if (packageManager === 'yarn') return 'yarn';
  return 'npm run';
}

export default function contractGuardTemplate(config) {
  const baseBranch = config.baseBranch;
  const install = installCommand(config.packageManager);
  const cmd = runCommand(config.packageManager);
  const cache = config.packageManager;

  return `name: Contract Guard

on:
  pull_request:
    branches: [${baseBranch}]
    types: [opened, edited, synchronize, reopened, ready_for_review]

permissions:
  contents: read

concurrency:
  group: contract-guard-\${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: \${{ github.event_name == 'pull_request' }}

jobs:
  contract:
    name: Contract Guard / contract
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: ${cache}

      - run: ${install}

      - run: ${cmd} contract:gitnexus
        env:
          GITNEXUS_IMPACT_SUMMARY: \${{ github.event.pull_request.body }}
`;
}
