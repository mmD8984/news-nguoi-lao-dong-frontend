export interface MegaMenuCategory {
  title: string;
  path: string;
  items: Array<{ label: string; path: string }>;
}

export interface MegaMenuMedia {
  label: string;
  path: string;
  icon: 'video' | 'image' | 'file-text' | 'bar-chart';
}

export interface MegaMenuUtility {
  label: string;
  path: string;
}

export interface MegaMenuData {
  mainCategories: MegaMenuCategory[];
  rightSide: {
    media: MegaMenuMedia[];
    utilities: MegaMenuUtility[];
  };
}
