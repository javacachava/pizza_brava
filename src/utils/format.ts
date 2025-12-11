export function formatPrice(value: number, currency = 'USD') {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(value);
}

export function formatDate(timestamp: number | Date) {
  const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return d.toLocaleString('es-SV');
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
