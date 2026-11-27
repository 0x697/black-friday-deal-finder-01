// main.js — boots the finder: fills the filter controls from the deal data,
// reads the initial state from the URL (?q=&cat=&store=&min=&sort=), and
// re-renders the grid on every change. No network calls, no storage.

import { DEALS, COMPARE, CATEGORIES, STORES, CHECKED_DAY } from './deals.js';
import { filterDeals, sortDeals } from './filters.js';
import { renderDeals, renderStats } from './render.js';
import { renderCompare } from './compare.js';

const grid = document.getElementById('deal-grid');
const stats = document.getElementById('stats-bar');
const compareMount = document.getElementById('compare-list');
const searchBox = document.getElementById('search');
const categoryBox = document.getElementById('category');
const storeBox = document.getElementById('store');
const discountBox = document.getElementById('min-discount');
const verdictBox = document.getElementById('verdict');
const sortBox = document.getElementById('sort');
const countLine = document.getElementById('result-count');

function fillOptions(box, values) {
  for (const v of values) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    box.appendChild(opt);
  }
}

fillOptions(categoryBox, CATEGORIES);
fillOptions(storeBox, STORES);

const params = new URLSearchParams(location.search);
searchBox.value = params.get('q') ?? '';
categoryBox.value = params.get('cat') ?? 'all';
storeBox.value = params.get('store') ?? 'all';
discountBox.value = params.get('min') ?? '0';
verdictBox.value = params.get('verdict') ?? 'all';
sortBox.value = params.get('sort') ?? 'best';

function currentState() {
  return {
    query: searchBox.value,
    category: categoryBox.value,
    store: storeBox.value,
    minDiscount: Number(discountBox.value),
    verdict: verdictBox.value,
    sort: sortBox.value,
  };
}

function apply() {
  const state = currentState();
  const filtered = filterDeals(DEALS, state);
  const sorted = sortDeals(filtered, state.sort);
  renderDeals(sorted, grid);
  renderStats(sorted, DEALS, stats);
  countLine.textContent =
    filtered.length === DEALS.length
      ? `Showing all ${DEALS.length} checked deals, best first.`
      : `Showing ${filtered.length} of ${DEALS.length} deals.`;
  const next = new URLSearchParams();
  if (state.query) next.set('q', state.query);
  if (state.category !== 'all') next.set('cat', state.category);
  if (state.store !== 'all') next.set('store', state.store);
  if (state.minDiscount) next.set('min', String(state.minDiscount));
  if (state.verdict !== 'all') next.set('verdict', state.verdict);
  if (state.sort !== 'best') next.set('sort', state.sort);
  history.replaceState(null, '', next.toString() ? '?' + next.toString() : location.pathname);
  window.__shotReady = true;
}

for (const box of [searchBox, categoryBox, storeBox, discountBox, verdictBox, sortBox]) {
  box.addEventListener('input', apply);
  box.addEventListener('change', apply);
}

document.getElementById('checked-day').textContent = CHECKED_DAY;
renderCompare(COMPARE, compareMount);
apply();
