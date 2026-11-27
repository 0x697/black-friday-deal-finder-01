// filters.js — discount maths and the search / filter / sort rules.
// Nothing here touches the DOM; render.js calls these and paints the result.

export function discountPct(deal) {
  return Math.round(((deal.usual - deal.sale) / deal.usual) * 100);
}

export function saved(deal) {
  return deal.usual - deal.sale;
}

export function money(n) {
  return '$' + n.toFixed(2).replace(/\.00$/, '');
}

const VERDICT_RANK = { 'new-low': 0, strong: 1, modest: 2, routine: 3 };

export function sortDeals(deals, sort) {
  const list = [...deals];
  switch (sort) {
    case 'discount':
      return list.sort((a, b) => discountPct(b) - discountPct(a) || saved(b) - saved(a));
    case 'saving':
      return list.sort((a, b) => saved(b) - saved(a));
    case 'price-asc':
      return list.sort((a, b) => a.sale - b.sale);
    case 'price-desc':
      return list.sort((a, b) => b.sale - a.sale);
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'best':
    default:
      return list.sort(
        (a, b) =>
          VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
          discountPct(b) - discountPct(a),
      );
  }
}

export function filterDeals(deals, { query = '', category = 'all', store = 'all', minDiscount = 0, verdict = 'all' } = {}) {
  const q = query.trim().toLowerCase();
  return deals.filter((d) => {
    if (category !== 'all' && d.category !== category) return false;
    if (store !== 'all' && d.store !== store) return false;
    if (verdict !== 'all' && d.verdict !== verdict) return false;
    if (discountPct(d) < minDiscount) return false;
    if (q && !(d.name + ' ' + d.blurb + ' ' + d.store + ' ' + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
}
