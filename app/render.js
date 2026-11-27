// render.js — turns deals into cards and paints the stats bar.
// Every field on a card comes from deals.js; nothing is invented here.

import { discountPct, saved, money } from './filters.js';
import { VERDICTS } from './deals.js';

export function dealCard(deal) {
  const pct = discountPct(deal);
  const v = VERDICTS[deal.verdict];
  return `<article class="deal-card" data-id="${deal.id}">
    <div class="card-top">
      <span class="verdict verdict-${deal.verdict}">${v.label}</span>
      <span class="discount-badge">−${pct}%</span>
    </div>
    <h3>${deal.name}</h3>
    <p class="blurb">${deal.blurb}</p>
    <div class="price-row">
      <span class="sale-price">${money(deal.sale)}</span>
      <span class="usual-price"><s>${money(deal.usual)}</s></span>
      <span class="save">Save ${money(saved(deal))}</span>
    </div>
    <p class="verdict-note">${v.note}. ${deal.evidence}</p>
    <p class="meta">
      <span class="store-chip">${deal.store}</span>
      <span>Checked ${deal.checked}</span>
      <span>Ends ${deal.ends}</span>
    </p>
    <p class="source">Price read from: ${deal.source}.</p>
    <p class="condition">${deal.condition}</p>
    <a class="store-link" href="${deal.link}" target="_blank" rel="noopener">View at ${deal.store} →</a>
  </article>`;
}

export function renderDeals(deals, mount) {
  mount.innerHTML = deals.length
    ? deals.map(dealCard).join('')
    : '<p class="empty">No deals match those filters. Loosen the search or pick another category.</p>';
}

export function renderStats(deals, all, mount) {
  const totalSaved = all.reduce((sum, d) => sum + saved(d), 0);
  const newLows = all.filter((d) => d.verdict === 'new-low').length;
  const stores = new Set(all.map((d) => d.store)).size;
  const cats = new Set(all.map((d) => d.category)).size;
  mount.innerHTML = `
    <span><strong>${deals.length}</strong> of ${all.length} deals shown</span>
    <span><strong>${newLows}</strong> at new lows</span>
    <span><strong>${stores}</strong> stores · <strong>${cats}</strong> categories</span>
    <span><strong>${money(totalSaved)}</strong> total savings on this page</span>`;
}
