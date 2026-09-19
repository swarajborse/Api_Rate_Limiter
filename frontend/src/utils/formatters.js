export function formatTimestamp(date) {
  return new Date(date).toLocaleString();
}

export function formatMillis(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}
