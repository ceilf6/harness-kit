export default function issueTemplatesTemplate(config) {
  const discussionsUrl = config.discussionsUrl;

  const bug = `name: Bug Report
description: Report a reproducible problem in this repository.
title: "[Bug] "
labels: ["bug"]
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What happened, and what did you expect instead?
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Reproduction
      description: Provide the smallest steps that reproduce the bug.
      placeholder: |
        1. Run ...
        2. Open ...
        3. Observe ...
    validations:
      required: true
  - type: input
    id: affected-area
    attributes:
      label: Affected Area
      description: For example frontend, agent-prompts, docs, CI, Harness.
    validations:
      required: true
  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: Include OS, Node version, package manager version, browser, and version or commit.
      placeholder: |
        - OS:
        - Node:
        - Package manager:
        - Browser:
        - Version:
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Logs Or Screenshots
      description: Paste relevant logs or screenshots. Remove secrets before posting.
    validations:
      required: false
  - type: checkboxes
    id: contribution
    attributes:
      label: Contribution
      options:
        - label: I am willing to submit a PR for this bug.
          required: false
`;

  const feature = `name: Feature Request
description: Propose a new capability or behavior change.
title: "[Feature] "
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What user or maintainer problem does this solve?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposed Behavior
      description: Describe the expected behavior and user-facing shape.
    validations:
      required: true
  - type: input
    id: affected-area
    attributes:
      label: Affected Area
      description: For example frontend, agent-prompts, docs, CI, Harness.
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: What other approaches did you consider?
    validations:
      required: false
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance Criteria
      description: List concrete checks that would prove the feature is complete.
    validations:
      required: true
  - type: checkboxes
    id: contribution
    attributes:
      label: Contribution
      options:
        - label: I am willing to submit a PR for this feature.
          required: false
`;

  const maintenance = `name: Maintenance Task
description: Propose refactoring, documentation, CI, dependency, or Harness maintenance.
title: "[Maintenance] "
labels: ["maintenance"]
body:
  - type: textarea
    id: reason
    attributes:
      label: Reason
      description: Why is this maintenance useful now?
    validations:
      required: true
  - type: input
    id: affected-area
    attributes:
      label: Affected Area
      description: For example CI, docs, Harness, dependency, test suite.
    validations:
      required: true
  - type: textarea
    id: proposed-change
    attributes:
      label: Proposed Change
      description: Describe the intended change and any alternatives.
    validations:
      required: true
  - type: textarea
    id: verification
    attributes:
      label: Verification Plan
      description: Which commands, tests, or reviews should prove this task is safe?
    validations:
      required: true
  - type: checkboxes
    id: contribution
    attributes:
      label: Contribution
      options:
        - label: I am willing to submit a PR for this maintenance task.
          required: false
`;

  const configYml = `blank_issues_enabled: true
contact_links:
  - name: Questions And Discussions
    url: ${discussionsUrl}
    about: Ask questions or discuss ideas before opening an issue.
`;

  return { bug, feature, maintenance, config: configYml };
}
