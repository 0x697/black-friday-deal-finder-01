# Real Deal Friday — black-friday-deal-finder-01

A static Black Friday deal finder: 14 real deals, each price-checked at its
store on 27 Nov 2026, with sale price, usual price, discount, check time,
source, and an honest verdict (new low / strong price / modest cut /
routine sale). Search, category / store / discount / verdict filters, six
sort orders, and a same-product-across-stores comparison.

## Run it

```
node serve.ts          # serves app/ on http://localhost:8080
```

## Screenshots

```
node shots.mjs         # Playwright Chromium renders of the site itself
```

## Hand it in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the kit's vendored `buildDossier`.

## Deal sources

Every deal in `app/deals.js` names the store page or deals source its price
was read from, and the date that source published or verified it. Store
links open the matching product at the store.
