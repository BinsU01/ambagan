// The API stores money in CENTAVOS (integers). Convert only at the edges.

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

// 54000 -> "₱540.00"
export function formatPeso(centavos) {
  return peso.format((centavos || 0) / 100);
}

// "540.50" -> 54050   ("abc" -> NaN, so validate before sending)
export function toCentavos(input) {
  const value = Number(String(input).replace(/,/g, ''));
  if (!Number.isFinite(value)) return NaN;
  return Math.round(value * 100);
}
