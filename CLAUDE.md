# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server at localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

No test suite is configured.

## Environment

`.env.local` must have:
```
NEXT_PUBLIC_API_URL=https://be-blg-production.up.railway.app/api
```
> **Note:** The current `.env.local` is missing the `/api` suffix — `src/lib/api.ts` appends nothing, so requests will fail without it.

## Architecture

### Route Groups (App Router)
- `(auth)` — `/login`, `/register` — centered layout, no navbar, no Redux slices active
- `(main)` — all other routes — wraps content with `<Navbar>` from `src/components/layout/`

The root `layout.tsx` wraps everything in `<StoreProvider>` (Redux). There is currently **no Next.js middleware** for route protection; auth guards are client-only.

### State Management (Redux Toolkit)
Four slices in `src/store/index.ts`:

| Slice | File | Manages |
|-------|------|---------|
| `auth` | `src/features/auth/authSlice.ts` | JWT token (localStorage), user object, **and** full login/register form state |
| `posts` | `src/features/posts/postSlice.ts` | Post list, current post, pagination |
| `comments` | `src/features/comments/commentSlice.ts` | Comments for current post |
| `profile` | `src/features/profile/profileSlice.ts` | Current user profile |

Use `useAppSelector` / `useAppDispatch` from `src/store/hooks.ts` (typed wrappers).

`serializableCheck` is disabled in middleware — File objects for image uploads pass through Redux state.

### Feature Modules
Each feature under `src/features/<name>/` follows this pattern:
- `<name>.service.ts` — raw Axios calls, returns typed data
- `<name>Slice.ts` — Redux slice with async thunks that call the service
- `hooks/use<Name>.ts` — custom hook that dispatches thunks and selects state
- `components/` — UI components scoped to this feature

### API Layer
- `src/lib/api.ts` — Axios instance; request interceptor injects `Authorization: Bearer <token>` from `localStorage`; response interceptor auto-redirects to `/login` on 401
- `src/constants/api.ts` — all endpoint strings (`API_ENDPOINTS`) and `API_BASE_URL`
- `src/constants/routes.ts` — all client-side route strings (`ROUTES`), plus `isPublicRoute()` / `isProtectedRoute()` helpers

### Shared Utilities
- `src/types/index.ts` — all TypeScript interfaces (source of truth for API shape)
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/hooks/useDebounce.ts` — debounce for search input
- `src/utils/formatDate.ts`, `src/utils/validation.ts` — date formatting and form validators
