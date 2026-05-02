# Progress

## Architecture Rating: 5/10

### Strengths
- Feature-based folder structure (`src/features/<name>/`) with clean service/slice/hooks/components separation
- Centralized API endpoints (`src/constants/api.ts`) and routes (`src/constants/routes.ts`)
- Typed store hooks in `src/store/hooks.ts`

### Issues Found

| Priority | Issue | File | Fix |
|----------|-------|------|-----|
| 🔴 Critical | `.env.local` missing `/api` suffix — all API calls hit wrong base URL | `.env.local` | Change to `NEXT_PUBLIC_API_URL=https://be-blg-production.up.railway.app/api` |
| 🔴 Critical | No server-side route protection — `/profile`, `/write` only guarded client-side | `src/app/(main)/` | Add `middleware.ts` at project root |
| 🟡 Medium | Form field state in Redux (`loginForm`, `registerForm`) — overkill for local UI state | `src/features/auth/authSlice.ts` | Move to `useState` in `LoginForm.tsx` / `RegisterForm.tsx` |
| 🟡 Medium | `console.log('API_BASE_URL:', ...)` left in production code | `src/lib/api.ts:12` | Remove |
| 🟡 Medium | `serializableCheck: false` disables check globally; only File uploads need exemption | `src/store/index.ts` | Use `ignoredActions` for specific upload thunks |
| 🟢 Low | `AuthGuard.tsx` and `Protected.tsx` are empty files | `src/components/shared/` | Implement or delete |
| 🟢 Low | No test setup at all | — | Add Vitest or Jest + React Testing Library |

---

## Planned Changes

### Phase 1 — Bug Fixes (agreed)
- [ ] Fix `.env.local`: add `/api` suffix to `NEXT_PUBLIC_API_URL`
- [ ] Remove `console.log` from `src/lib/api.ts`

### Phase 2 — Architecture Improvements (agreed)
- [ ] Add `src/middleware.ts` for server-side route protection
- [ ] Refactor `authSlice`: remove `loginForm`/`registerForm` state, move to local state in components
- [ ] Scope `serializableCheck` to only affected actions instead of blanket `false`
- [ ] Implement or remove `AuthGuard.tsx` and `Protected.tsx`

### Phase 3 — Bonus Features (from README checklist)
- [ ] Search functionality (SearchBar exists, wire up to `/search` page)
- [ ] Pagination (Pagination component exists, integrate into PostList)
- [ ] SEO optimization (metadata per page)
- [ ] Animations/transitions

---

## Session Log

| Date | Work Done | Tokens Used |
|------|-----------|-------------|
| 2026-05-02 | Initial codebase analysis, created CLAUDE.md, architecture rating, this progress.md | — |
