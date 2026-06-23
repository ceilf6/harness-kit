import contractRules from './contract-rules.mjs';
import contractCheck from './contract-check.mjs';
import installHooks from './install-hooks.mjs';
import hooks from './hooks.mjs';
import workflowTest from './workflow-test.mjs';
import prTemplate from './pr-template.mjs';
import issueTemplates from './issue-templates.mjs';
import codeowners from './codeowners.mjs';
import contractGuard from './contract-guard.mjs';
import contributing from './contributing.mjs';
import workflowMd from './workflow-md.mjs';
import knowledgeContract from './knowledge-contract.mjs';
import harnessWorkflow from './harness-workflow.mjs';
import agentsSnippet from './agents-snippet.mjs';
import claudeSnippet from './claude-snippet.mjs';
import eslintConfig from './eslint-config.mjs';
import vitestConfig from './vitest-config.mjs';

export default [
  { path: 'scripts/workflows/contract-rules.mjs', generate: contractRules },
  { path: 'scripts/workflows/contract-check.mjs', generate: contractCheck },
  { path: 'scripts/workflows/install-hooks.mjs', generate: installHooks },
  { path: '.githooks/pre-commit', generate: (config) => hooks(config).preCommit },
  { path: '.githooks/pre-push', generate: (config) => hooks(config).prePush },
  { path: 'scripts/tests/workflow-rules.test.mjs', generate: workflowTest },
  { path: '.github/PULL_REQUEST_TEMPLATE.md', generate: prTemplate },
  { path: '.github/ISSUE_TEMPLATE/bug.yml', generate: (config) => issueTemplates(config).bug },
  { path: '.github/ISSUE_TEMPLATE/feature.yml', generate: (config) => issueTemplates(config).feature },
  { path: '.github/ISSUE_TEMPLATE/maintenance.yml', generate: (config) => issueTemplates(config).maintenance },
  { path: '.github/ISSUE_TEMPLATE/config.yml', generate: (config) => issueTemplates(config).config },
  { path: '.github/CODEOWNERS', generate: codeowners },
  { path: '.github/workflows/contract-guard.yml', generate: contractGuard },
  { path: 'CONTRIBUTING.md', generate: contributing },
  { path: 'docs/workflow.md', generate: workflowMd },
  { path: 'docs/knowledge-contract.md', generate: knowledgeContract },
  { path: 'docs/oss-harness-engineering-workflow.md', generate: harnessWorkflow },
  { path: 'AGENTS.md', generate: agentsSnippet },
  { path: 'CLAUDE.md', generate: claudeSnippet },
  { path: 'eslint.config.js', generate: eslintConfig },
  { path: 'vitest.config.ts', generate: vitestConfig },
];
