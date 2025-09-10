import type { PaletteConfig, PaletteItemConfig } from '@axonivy/ui-components';
import type { PaletteItem } from '@eclipse-glsp/client';

export interface MenuPaletteItem extends PaletteItem {
  description?: string;
  info?: string;
  children?: MenuPaletteItem[];
}

export function sortPaletteItems(left: PaletteItem, right: PaletteItem): number {
  return left.sortString.localeCompare(right.sortString) || left.label.localeCompare(right.label);
}

export type PaletteSections<T extends PaletteItemConfig = PaletteItemConfig> = PaletteConfig<T>['sections'];

export function paletteItemsToSections<ITEM extends PaletteItem = PaletteItem, CONFIG extends PaletteItemConfig = PaletteItemConfig>(
  items: ITEM[],
  converter: (item: ITEM) => CONFIG
): PaletteSections<CONFIG> {
  return items.sort(sortPaletteItems).reduce((sections, item) => {
    const section = sections[item.label] ?? [];
    const children = item.children ?? [item];
    children.sort(sortPaletteItems).forEach(child => section.push(converter(child as ITEM)));
    sections[item.label] = section;
    return sections;
  }, {} as PaletteSections<CONFIG>);
}
