# Coding Standards

## TypeScript

- Use strict mode.
- Avoid `any`; prefer proper types, generics, discriminated unions, or `unknown` with narrowing.
- Define types for component props, domain models, API responses, and normalized data.
- Keep domain types in `src/types/` when reused across features.
- Let inference work when it keeps code clear.
- Avoid clever type gymnastics that make the code hard to interview-explain.

## React

- Use functional components.
- Keep components focused on one job.
- Prefer controlled props for reusable design-system components.
- Keep app state close to where it is needed until reuse or complexity justifies extraction.
- Extract custom hooks only when they improve clarity or testability.
- Avoid premature global state libraries.

## Vite

- Use Vite as the app build tool.
- Keep environment variables documented and prefixed correctly for Vite.
- Do not introduce Next.js patterns.
- Prefer simple app structure until routing, auth, or API integration requires more.

## Storybook

- Build reusable UI in Storybook first when practical.
- Every reusable component should include stories for common, edge, loading, empty, disabled, and responsive-relevant states where applicable.
- Add concise accessibility notes in story docs or descriptions.
- Use mock data in stories, not live YouTube API calls.
- Storybook should import the same design tokens as the app.

## Testing

- Use Vitest and React Testing Library.
- Prefer user-facing behavior over implementation details.
- Use `@testing-library/user-event` for interactions.
- Test accessible names, roles, keyboard behavior, disabled states, and important state changes.
- Do not chase 100% coverage blindly; focus on meaningful confidence.
- Add tests as part of the feature, not as a separate final cleanup.

## Component Driven Development

- Design reusable components as atoms, molecules, organisms, templates, or pages only where that classification helps.
- Keep component APIs small and explicit.
- Start with the smallest useful component and evolve from real usage.
- A component is not complete until it has stories, basic tests when behavior exists, and accessible markup.

## Styling

- Use CSS variables for tokens.
- Use plain CSS, CSS modules, or colocated CSS files based on the repo setup.
- Do not use Tailwind unless the stack changes explicitly.
- Do not hardcode recurring colors, spacing, radius, or shadows inside components.
- Prefer classes over inline styles unless the value is truly dynamic.
- Use mobile-first CSS and progressive enhancement.

## Design Tokens

Centralize tokens in `src/styles/tokens.css` or a similarly named file.

Token groups:

- Color
- Typography
- Spacing
- Radius
- Border
- Shadow
- Motion
- Layout
- Z-index

Use a clear prefix such as `--sr-`.

## File Organization

```text
src/
├── app/                # app shell, routes, page-level composition
├── components/         # reusable and feature UI
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── data/               # typed mock data
├── hooks/              # reusable hooks
├── services/           # API clients and external integration adapters
├── styles/             # tokens, reset, global styles
├── test/               # test utilities and setup
├── types/              # domain and API types
└── utils/              # pure utilities
```

## Naming

- Components: PascalCase
- Hooks: `useThing`
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types and interfaces: PascalCase
- CSS variables: kebab-case with `--sr-` prefix
- Test files: `ComponentName.test.tsx` or `utilityName.test.ts`
- Story files: `ComponentName.stories.tsx`

## Data

- Start with typed mock data.
- Keep mock data realistic enough to expose layout issues.
- Keep user-facing mock content separate from component logic.
- Normalize YouTube API data into internal app types later.
- Do not let YouTube API response shapes leak through the whole UI.

## Accessibility

- Use semantic HTML first.
- Every button must be a real `button` unless there is a strong reason otherwise.
- Cards that navigate must be links or contain clearly labeled actions.
- Use visible focus states.
- Avoid hover-only interactions.
- Ensure touch targets are practical on mobile.
- Prefer accessible names that match visible labels.

## Error Handling

- Handle fallible browser, network, OAuth, and async operations deliberately.
- Show user-facing failures in a consistent way.
- Keep error copy useful and calm.
- For YouTube API work, distinguish auth errors, quota issues, empty results, and network failures.

## Code Quality

- No commented-out code unless there is a short-lived, explained reason.
- No unused imports or variables.
- Favor readable functions over clever abstractions.
- Keep PRs small and reviewable.
- Do not refactor unrelated areas while implementing a feature.
