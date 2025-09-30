---
trigger: manual
---

# Next.js 15 + Token Studio Project Rules

## Scope

- Frontend only (mock auth: POST /api/auth/login in App Router).
- No CI/CD, no responsive this sprint.
- No shadcn/ui. Use plain TSX + Tailwind v4 utilities.
- Validation: Zod at the submit boundary (client).

##Styling

- No design tokens for now.
- Prefer plain Tailwind utility classes (bg-slate-50, rounded-2xl, shadow-[...]).
- If duplication grows, later extract minimal CSS vars into globals.css (optional).

## Architecture

- Next.js App Router + React 19.
- Login page is a Client Component ("use client").
- Dev: next dev --turbopack.

## Forms & Validation

- Client-side form with local useState.
- On submit: loginSchema.safeParse(...) → fetch('/api/auth/login').
- Status mapping: 200 OK, 401 invalid creds, 423 locked, (opt 429 rate limit).
- Show one error at a time; focus first invalid field.

##State Management

- No global store (Zustand/Redux) for now.
- Use local useState for loading / error / showPassword.
- Revisit global store when multiple pages need shared session/user.

## Routing & Metadata

- Place under route group (auth).
- Static metadata is fine; skip dynamic SEO.

## Accessibility

- label–input association, aria-invalid, role="alert".
- Linear tab order; visible focus ring.

## Security (frontend scope)

- Never log sensitive fields.
- autocomplete="email" / "current-password".
- Cookies/CSRF are out of scope until real backend.

## OpenAPI

- Provide openapi.yaml for /api/auth/login (200 / 401 / 423).
- Keep Zod schema aligned with OpenAPI via z.infer.

## Out of Scope (this sprint)

- Design tokens/theming, Server Actions migration, TanStack Query, PPR tuning,
- SSO/2FA, CI/CD, responsiveness, analytics.
