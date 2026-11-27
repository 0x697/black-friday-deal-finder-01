// compare.js — the "same product, every store" section. Renders one block
// per product in COMPARE, marks the cheapest price, and names the source
// the prices were read from.

import { money } from './filters.js';

export function renderCompare(compare, mount) {
  const blocks = compare
    .map((row) => {
      const cheapest = Math.min(...row.prices.map((p) => p.price));
      const chips = row.prices
        .map(
          (p) =>
            `<span class="price-chip${p.price === cheapest ? ' cheapest' : ''}">${p.store}: <strong>${money(p.price)}</strong>${p.price === cheapest ? ' ★ cheapest' : ''}</span>`,
        )
        .join('');
      return `<article class="compare-block">
        <h3>${row.product}</h3>
        <div class="price-chips">${chips}</div>
        <p class="compare-source">Prices read from each store — source: ${row.source}.</p>
      </article>`;
    })
    .join('');
  mount.innerHTML = blocks;
}
