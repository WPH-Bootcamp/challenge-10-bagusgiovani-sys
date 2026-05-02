# Fixes

Tracks completed changes pushed to `origin/main`.

## Format
Each entry: date, what changed, files touched, commit hash.

---

## 2026-05-02 — `0d70830` — Phase 1 + Phase 2 architecture fixes

**Files changed:** 12 files, +258 / -474

| Change | Full File Path |
|--------|----------------|
| Fix missing `/api` in base URL | `.env.local` |
| Remove `console.log` debug line | `src/lib/api.ts:12` |
| Cookie sync for SSR auth (`setAuthToken`, `removeAuthToken`) | `src/lib/api.ts` |
| Server-side route protection middleware (new file) | `src/middleware.ts` |
| Login form state moved from Redux to local useState | `src/features/auth/components/LoginForm.tsx` |
| Register form state moved from Redux to local useState | `src/features/auth/components/RegisterForm.tsx` |
| authSlice stripped to server state only (removed loginForm/registerForm) | `src/features/auth/authSlice.ts` |
| serializableCheck scoped via ignoredActionPaths | `src/store/index.ts` |
| Deleted empty stub | `src/components/shared/AuthGuard.tsx` |
| Deleted empty stub | `src/components/shared/Protected.tsx` |
| Project guidance for Claude Code | `CLAUDE.md` |
| Architecture rating and planned changes | `progress.md` |
| This change log | `fixes.md` |
