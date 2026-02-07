export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toLocaleString();
  }
  if (Math.abs(num) >= 1000) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }
  if (Math.abs(num) < 0.01 && num !== 0) {
    return num.toExponential(2);
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
