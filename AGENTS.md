## Critical Rules

- Never use `any`.
- Never create a component longer than 150 lines.
- If a component exceeds 150 lines, split it into smaller components automatically.
- Never declare nested components.
- Always separate UI from logic.

## Component Architecture

- Keep components focused on rendering.
- Move business logic, side effects, and derived state to custom hooks.
- Prefer composition over large prop-driven components.
- Components should have explicit prop types.

## Forms

- Always use React Hook Form for forms.
- Always use Zod for schema validation.
- Keep schemas outside component files when they grow.

## File Organization

- Organize by feature when possible.
- Keep hooks, components, schemas, and services separated.
