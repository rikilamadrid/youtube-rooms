# AI Interaction Guidelines

Use this file to guide Claude Code, Codex, and similar AI coding agents.

## Communication

- Be concise and direct.
- Explain non-obvious decisions briefly.
- Ask before large refactors or architectural changes.
- Do not add features that are not in the current feature spec.
- Do not delete files without clarification.
- When teaching, explain the senior-engineering reason behind the step, not just the command.

## Product Context

This project is both a product and a learning vehicle.

Product goal:

- Organize YouTube subscriptions into focused rooms and watch queues.

Learning goal:

- Practice Senior Frontend Engineer skills through React, TypeScript, Vite, Storybook, design systems, accessibility, testing, CI/CD, semantic versioning, and AI workflow.

## Default Workflow

1. Read `context/current-feature.md`.
2. Read the relevant feature file in `context/features/`.
3. Read `context/project-overview.md`, `context/coding-standards.md`, and this file only as needed.
4. Restate the implementation plan before changing code.
5. Confirm the current branch and working tree status.
6. Create or switch to the intended feature branch.
7. Implement the scoped work only.
8. Add or update Storybook stories when the feature touches reusable UI.
9. Add or update tests for behavior, utilities, or component state.
10. Verify mobile-first behavior in the browser or Storybook.
11. Run typecheck, lint, test, build, and Storybook build when available.
12. Add or update `CHANGELOG.md` under `## [Unreleased]`.
13. Ask before committing.
14. After merge, update `context/current-feature.md` and `context/history.md`.

Do not commit without permission, and do not commit if the build is failing.

## Pre-Implementation Restatement

Before implementing any feature, restate:

1. The goal
2. The files expected to change
3. The risks
4. The verification plan
5. What will not be done
6. The current branch
7. The intended feature branch
8. Whether the working tree is clean

This keeps the workflow deliberate and prevents scope creep.

## Branching

- Create a new branch for every feature or fix.
- Use clear names like `feature/01-project-foundation` or `fix/video-card-focus-state`.
- Do not work directly on `main` after the initial setup.

## Commits

- Ask before committing.
- Prefer conventional commits.
- Keep commits focused on one feature or fix.
- Do not include AI attribution, co-author trailers, or generated-by footers.

Examples:

```bash
feat: add design token foundation
feat: add room card component
fix: improve video card keyboard focus
chore: add storybook ci build
```

## Versioning

- Use Semantic Versioning: `MAJOR.MINOR.PATCH`.
- Keep `CHANGELOG.md` in Keep a Changelog format.
- Add real, human-readable entries under `## [Unreleased]` while work is in progress.
- Use `PATCH` for backward-compatible fixes.
- Use `MINOR` for backward-compatible features.
- Use `MAJOR` for breaking user-facing changes.
- Do not bump versions automatically without user approval.

## Component Driven Development Rules

- Reusable UI starts in Storybook when practical.
- Every design-system component should have stories and accessible markup.
- Keep props intentional and typed.
- Prefer simple composition over complex configuration.
- Do not create a giant component library before real product needs exist.

## Test Driven Development Rules

- For pure utilities, write tests before or alongside implementation.
- For UI components, write tests for behavior that matters to users.
- Prefer accessible queries: `getByRole`, `getByLabelText`, `getByText` when appropriate.
- Avoid testing class names, internal state, or implementation details.
- Tests should make refactors safer, not harder.

## YouTube API Rules

- Do not add YouTube OAuth or live API calls until the relevant feature file is active.
- Use typed mocks before live API data.
- Treat API quota and policy compliance as product constraints.
- Do not download, rehost, or bypass YouTube playback.
- Use official embed/player approaches for playback.

## When Stuck

- If something is not working after 2-3 grounded attempts, stop and explain the issue.
- Do not keep trying random fixes.
- Suggest the smallest next diagnostic step.
- Preserve the user's time and the repo's stability.

## Code Review Priorities

1. Security and privacy
2. Accessibility
3. Logic correctness and edge cases
4. Component API clarity
5. Test usefulness
6. Performance
7. Consistency with the existing codebase
8. Maintainability and interview explainability
