export const uniq = (xs: string[]): string[] => {
  const seen = new Set<string>();
  return xs.filter((x) => {
    if (seen.has(x)) {
      return false;
    }
    seen.add(x);
    return true;
  });
};
