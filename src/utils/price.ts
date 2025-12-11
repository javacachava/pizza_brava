export const round2 = (n: number): number => {
  return Math.round(n * 100) / 100;
};

export function sumPrices(...values: number[]) {
  return round2(values.reduce((s, v) => s + v, 0));
}
