import type { PaletteItem } from '@eclipse-glsp/client';

export function sortPaletteItems(left: PaletteItem, right: PaletteItem): number {
  const result = left.sortString.localeCompare(right.sortString);
  if (result !== 0) {
    return result;
  }
  return left.label.localeCompare(right.label);
}
