# Hom nay an gi 🍜

**Website: [codinghusk3y.github.io/homnayangi](https://codinghusk3y.github.io/homnayangi/)**

Can't decide what to eat? Open a case, spin for a dish, and add a little surprise to your day.

This is the community version that runs on your computer, with no login or backend required. The case starts empty: pick dishes from the built-in catalog or add your own, and everything is saved in your browser.

## Run locally

You need **Node.js 22.12+** and the **pnpm** version specified in [package.json](package.json).

```sh
git clone https://github.com/CodingHusk3y/homnayangi.git
cd homnayangi
pnpm install --frozen-lockfile
pnpm start
```

Open [127.0.0.1:5173](http://127.0.0.1:5173). No `.env` file or external service setup is needed. If the port is busy, run `pnpm start --port 5188`.

Development commands:

```sh
pnpm test       # Run checks
pnpm build      # Create a build
pnpm preview    # Preview at http://127.0.0.1:4173
```

The servers bind to `127.0.0.1` only. Once dependencies are installed, the app loads its assets locally; external links open only when you click them.

## What's in the case

The case starts empty. Open **My dishes** to:

- tick dishes from the built-in catalog of ~130 (with search, and buttons to select or clear everything or just the filtered dishes),
- add, edit and delete your own dishes (name 1–60 characters, price $3–$150, up to 50),
- clear the whole saved list and go back to an empty case.

### Prices and rarity

A dish's tier is not random and is not rolled at spin time: it is read straight off the price by `priceRarity`, at 40k / 65k / 100k / 130k. Set a dish's price and you have set its tier.

Prices are stored in thousands of VND. The English view restates them on an Atlanta lunch scale at $0.30 per 1,000 ₫, anchoring the catalog's typical 50k lunch to a ~$15 fast-casual lunch. That is a comparison of what lunch costs in each place, **not** an exchange rate: converting at the market rate would price a phở at $2.20 and leave every dish in the cheapest tier. The tiers therefore read as ≤$12, ≤$19.50, ≤$30, ≤$39 and above.

The rate is the constant `USD_PER_THOUSAND_VND` in `src/lib/i18n.ts`; the app never fetches a live quote.

Every change saves immediately — there is no save button. If you used an earlier version, where every dish started enabled, your old cookie is converted on load so your list carries over.

## Your data

Preferences, meal lists, and spin counts are saved automatically in cookies in your current browser. Clearing cookies resets this data; it does not sync across devices. The displayed spin count belongs to this browser only.

If cookies are blocked or a meal list is too large, the app will let you know it could not save.

## GitHub Pages and the official website

GitHub Pages for the repository only redirects to https://codinghusk3y.github.io/homnayangi/. This keeps functionality consistent: visitors always use the same production frontend, API, and same-origin login cookie instead of a second static app that can drift or lose authentication on refresh. Only `pages-redirect/` is published to that repository's `gh-pages`.

**A fork may publish its own community copy** to its own GitHub Pages:

```sh
pnpm deploy:pages              # build, then push dist/ to the gh-pages branch of `origin`
pnpm deploy:pages --dry-run    # build and commit, without pushing
```

The script derives the base path from the repository name (`/<repo>/`), adds `.nojekyll` and `404.html`, and **refuses** to push to `codinghusk3y.github.io/homnayangi`. After the first run, enable Pages for your fork from the `gh-pages` branch (root); the site lives at `https://<owner>.github.io/<repo>/`. A fork deployment stays `noindex`, adds no login and no backend, and does not affect homnayangi.com's DNS. Shared static UI and reel-motion fixes should be updated in both this repository and the private production frontend.


