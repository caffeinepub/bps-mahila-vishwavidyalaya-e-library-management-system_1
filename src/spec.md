# Specification

## Summary
**Goal:** Allow one-time recovery bootstrapping so the currently signed-in user can become the initial Admin using the existing bootstrap secret, and provide a guided frontend flow using a token link.

**Planned changes:**
- Add a backend shared update method in `backend/main.mo` that accepts the bootstrap secret and makes the authenticated caller an Admin only if no admin has been initialized yet; otherwise return an explicit error.
- Validate the bootstrap secret on the backend and reject missing/invalid secrets without changing any roles.
- Implement a frontend flow that reads `caffeineAdminToken` from the URL hash (via existing URL utilities), stores it in `sessionStorage` for the session, clears it from the address bar, and after Internet Identity login calls the backend bootstrapping method.
- After the bootstrap call, refresh/invalidate React Query state so `useIsCallerAdmin()` updates in-session and the Admin Dashboard link becomes visible immediately on success.
- Add a minimal English guidance message for signed-in non-admin users explaining the one-time admin initialization via a special `#caffeineAdminToken=...` link + login, without ever displaying the token value; show clear, non-crashing English errors on failure (invalid token or already initialized).

**User-visible outcome:** A user can open the app with a special `#caffeineAdminToken=...` link, sign in, and (only if no admin exists yet) become the Admin in the same session; otherwise they see a clear error and can continue using the app normally.
