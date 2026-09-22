# Community frontend

- Before proposing, designing, implementing or releasing a user-facing change, read and follow the normative `PRODUCT_PHILOSOPHY.md` in the `homnayangi-com/infrastructure` repository. A passing build does not override its product gates.
- This public repository preserves the history of nagisanzenin/homnayangi, transferred with Walter's explicit authorization on 2026-09-10.
- Keep community participation open: welcome issues and fork PRs to `main` in Vietnamese or English, including draft PRs. Do not require a prior approved issue, internal ticket, enterprise membership, organization invitation, estimates, project boards, mandatory templates or multiple approvals.
- Maintainers review changes before merging and may help contributors with checks proportional to the change. Keep repository settings and contribution guidance community-friendly; enterprise-only policies belong to the private repositories.
- Current code is a standalone static frontend. No backend, OAuth/login, production API clients, cloud credentials or infrastructure state.
- Use pnpm, compatible current stable packages and committed lockfiles. Build locally; do not add Entire, GitHub Projects or a CI pipeline for MVP.
- Store preferences in bounded, versioned, host-only cookies. Validate imported/untrusted values and handle unavailable/full storage visibly.
- Counter is browser-local, never label it a global/community total.
- homnayangi.com remains on Cloudflare + GCP using three private repositories. Never point its DNS to GitHub Pages.
- Retain source and asset attribution. Historical code does not define the current deployment.

- GitHub Pages of `homnayangi-com/homnayangi` redirects to https://homnayangi.com/ by explicit request. Publish only pages-redirect/ to its gh-pages; keep the standalone application source in main.

- Fork exception: a fork may publish a build of the app to its own GitHub Pages at `https://<owner>.github.io/<repo>/` with `pnpm deploy:pages`, which refuses to push to `homnayangi-com/homnayangi`. A fork deployment is a community copy, not the product: it stays `noindex`, keeps cookie-only persistence, and adds no login, account screens, backend endpoints or database clients. homnayangi.com's DNS is unaffected and still never points to GitHub Pages.

- This app is for local use or a fork's own Pages copy: bind dev/preview to loopback, use cookie-only automatic persistence, and do not add login, account screens, backend endpoints, database clients or a hosted demo presented as the official site. Only user-clicked external links may leave the app; background asset loads stay same-origin.

- The case starts empty. Catalog dishes in `src/lib/foods.ts` are opt-in, stored as the `enabled` ids in the pool cookie; legacy `disabled` cookies migrate on read. Do not reintroduce a default-on pool.
