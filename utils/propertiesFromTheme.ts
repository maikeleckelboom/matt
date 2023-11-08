import {
  type CustomColor,
  hexFromArgb,
  Scheme,
  type Theme,
  TonalPalette,
} from '@material/material-color-utilities';
import { toCamelCase } from '~/utils/index';

export type CustomColorHex = Omit<CustomColor, 'value'> & { value: string };

export type KeyColorPalette = { name: string } & TonalPalette['keyColor'];

type SubsetOption = 'scheme' | 'scheme.light' | 'scheme.dark' | 'palettes';

export type ThemeConfig = {
  source: string;
  dark?: boolean;
  paletteTones?: number[];
  customColors: CustomColorHex[];
  properties: {
    suffix?: string;
    prefix?: string;
    subset?: SubsetOption[];
    transform?: (argb: number) => string | number;
  }[];
};

export const TONES_DEFAULT = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100] as const;

function getSchemeProperties(scheme: Scheme, options: ThemeConfig['properties'][number]) {
  const prefix = options?.prefix ?? '';
  const suffix = options?.suffix ?? '';
  const properties: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(scheme.toJSON())) {
    const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    properties[`--${prefix}${token}${suffix}`] =
      options?.transform && typeof options.transform === 'function'
        ? options.transform(value)
        : hexFromArgb(value);
  }

  return properties;
}

export function cssPropertiesFromTheme(theme: Theme, options: ThemeConfig) {
  const paletteTones = options?.paletteTones ?? TONES_DEFAULT;
  const isDarkMode = options?.dark ?? false;
  const scheme = isDarkMode ? theme.schemes.dark : theme.schemes.light;

  if (!options?.properties?.length) {
    const baseline = getSchemeProperties(scheme, {});
    const light = getSchemeProperties(theme.schemes.light, {
      suffix: '-light',
    });
    const dark = getSchemeProperties(theme.schemes.dark, {
      suffix: '-dark',
    });
    const customColors = {};
    // todo: add palettes and custom color palettes
    return { ...baseline, ...light, ...dark, ...customColors };
  }

  const [props] = options.properties.map((ctx) => {
    const prefix = ctx?.prefix ?? '';
    const suffix = ctx?.suffix ?? '';
    const baseline = !ctx?.subset || ctx?.subset?.includes('scheme') ? getSchemeProperties(scheme, ctx) : {};
    const light =
      !ctx?.subset || ctx?.subset?.includes('scheme.light')
        ? getSchemeProperties(theme.schemes.light, {
            ...ctx,
            suffix: `-light${suffix}`,
          })
        : {};
    const dark =
      !ctx?.subset || ctx?.subset?.includes('scheme.dark')
        ? getSchemeProperties(theme.schemes.dark, {
            ...ctx,
            suffix: `-dark${suffix}`,
          })
        : {};
    const palettes: Record<string, string | number> = {};
    if (!ctx?.subset || ctx?.subset?.includes('palettes')) {
      for (const [key, palette] of Object.entries(theme.palettes)) {
        const paletteKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        for (const tone of paletteTones) {
          const token = `${prefix}${paletteKey}${tone}`;
          palettes[`--${token}`] =
            ctx?.transform && typeof ctx.transform === 'function'
              ? ctx.transform(palette.tone(tone))
              : hexFromArgb(palette.tone(tone));
        }
      }
    }

    const customColors = options.customColors?.reduce(
      (acc, color) => {
        const token = toCamelCase(color.name)
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
        acc[`--${token}`] = color.value;
        return acc;
      },
      {} as Record<string, string | number>,
    );

    // console.log({ customColors });

    return { ...baseline, ...light, ...dark, ...palettes, ...customColors };
  });

  return props;
}
