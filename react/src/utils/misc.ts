export function range(end: number, step: number = 1): number[] {
  const result = [];
  for (let i = 0; i < end; i += step) {
    result.push(i);
  }
  return result;
}
