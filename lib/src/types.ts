type SubsetOption = 'scheme' | 'scheme.light' | 'scheme.dark' | 'palettes' | 'customColors';

type ThemePropertiesConfig = {
  isDark?: boolean;
  paletteTones?: number[];
  properties?: {
    suffix?: string;
    prefix?: string;
    subset?: SubsetOption[];
    transform?: (argb: number) => string | number;
  }[];
};

// type PropertyFormatterOptions = {
//   suffix?: string;
//   prefix?: string;
//   transform?: (argb: number) => string | number;
// }

type PropertyConfig = Omit<Required<ThemePropertiesConfig>['properties'][number], 'subset'>;

export type { ThemePropertiesConfig, PropertyConfig };
