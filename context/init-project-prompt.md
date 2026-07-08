# Initial Project Prompt For Claude Code Or Codex

Read the project documentation before doing anything else.

## Required Files To Read In Full

* `context/project-overview.md`
* `CLAUDE.md`
* `context/coding-standards.md`
* `context/ai-interaction.md`
* `context/current-feature.md`
* `context/example-feature-spec.md`

## Task

Initialize the AI-assisted project workflow by creating a sequential feature roadmap.

Follow the project-specific instructions inside:

* `context/project-overview.md`

Use this file as the required feature format reference:

* `context/example-feature-spec.md`

Create the feature roadmap inside:

* `context/features/`

## Important Scope Rules

Do not implement app code yet.

Do not install packages yet.

Do not create product components yet.

Do not create routes, screens, services, API clients, or data integrations yet.

Do not create feature branches yet unless the project documentation explicitly asks for that in this task.

Only create or update markdown files needed for the feature roadmap.

## Roadmap Requirements

Each feature file should represent one focused, reviewable slice of work.

Each feature should be small enough to support:

* A clear goal
* A clean implementation session
* A focused branch
* A focused pull request
* Meaningful verification
* Clean handoff to a future AI agent or human developer

Each feature file must follow the format in:

* `context/example-feature-spec.md`

Each feature file should include:

* Feature name
* Status
* Overview
* Problem
* Goal
* Requirements
* Out of scope
* UX notes
* Technical notes
* Acceptance criteria
* Verification steps
* References
* Suggested branch
* Suggested commit

## Workflow Rules

Before creating or editing files, restate:

1. The goal
2. The files expected to change
3. The risks
4. The verification plan
5. What will not be done
6. Whether `context/example-feature-spec.md` exists
7. Whether `context/features/` exists

Then create the feature roadmap.

## Constraints

Use the project overview as the source of truth for:

* Product idea
* Tech stack
* Architecture
* Design system
* Testing strategy
* Accessibility expectations
* CI/CD expectations
* Routing
* Data strategy
* Build phases
* Versioning and changelog rules
* Git workflow
* Things to avoid

Do not invent a different stack or architecture.

Do not override the project overview unless there is a clear conflict. If there is a conflict, stop and report it.

## Required Output After Roadmap Creation

After creating the feature files, summarize:

* Feature files created
* One-line purpose for each feature
* Build phase for each feature
* Suggested branch for each feature
* Suggested commit for each feature
* Which features create a visible or demoable win
* Recommended first feature to copy into `context/current-feature.md`
* Any assumptions made

Do not commit unless I explicitly approve.
