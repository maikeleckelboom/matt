import {
  type CustomColor,
  type CustomColorGroup,
  hexFromArgb,
  Scheme,
  type Theme,
  TonalPalette,
} from '@material/material-color-utilities';
import { toCamelCase } from '~/utils/index';

export type CustomColorHex = Omit<CustomColor, 'value'> & { value: string };

type SubsetOption = 'scheme' | 'scheme.light' | 'scheme.dark' | 'palettes' | 'customColors';

export type PropertiesConfig = {
  isDark?: boolean;
  paletteTones?: number[];
  properties: {
    suffix?: string;
    prefix?: string;
    subset?: SubsetOption[];
    transform?: (argb: number) => string | number;
  }[];
};

export const TONES_DEFAULT = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];

function getSchemeProperties(scheme: Scheme, options?: PropertiesConfig['properties'][number]) {
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

/**
 * IN PROGRESS
 */

function getCustomSchemeProperties(
  customColorGroup: CustomColorGroup,
  options: PropertiesConfig['properties'][number] & {
    isDark?: boolean;
  },
) {
  const prefix = options?.prefix ?? '';
  const suffix = options?.suffix ?? '';
  const properties: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(customColorGroup[options.isDark ? 'dark' : 'light'])) {
    const colorName = toCamelCase(customColorGroup.color.name)
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    const map = key.replace(/([a-z])(?=[A-Z])/g, '$1-').toLowerCase();
    const token = map.replace(/color/, colorName);
    properties[`--${prefix}${token}${suffix}`] =
      options?.transform && typeof options.transform === 'function'
        ? options.transform(value)
        : hexFromArgb(value);
  }
  return properties;
}

export function cssPropertiesFromTheme(
  theme: Theme,
  options: PropertiesConfig,
): Record<string, string | number>[] {
  const paletteTones = options?.paletteTones ?? TONES_DEFAULT;
  const isDarkMode = options?.isDark ?? false;
  const scheme = isDarkMode ? theme.schemes.dark : theme.schemes.light;

  if (!options?.properties?.length) {
    const base = getSchemeProperties(scheme);
    const light = getSchemeProperties(theme.schemes.light, {
      suffix: '-light',
    });
    const dark = getSchemeProperties(theme.schemes.dark, {
      suffix: '-dark',
    });
    const palettes = Object.entries(theme.palettes).reduce((acc, [key, palette]) => {
      const paletteProperties = getPropertiesFromPalette(key, palette, {
        paletteTones,
      });
      return { ...acc, ...paletteProperties };
    }, {});
    const customColors = theme?.customColors.reduce((acc, colorGroup) => {
      const baseColorGroupProperties = getCustomSchemeProperties(colorGroup, {
        isDark: isDarkMode,
      });
      const lightColorGroupProperties = getCustomSchemeProperties(colorGroup, {
        isDark: false,
        suffix: '-light',
      });
      const darkColorGroupProperties = getCustomSchemeProperties(colorGroup, {
        isDark: true,
        suffix: '-dark',
      });
      const customColorPaletteProperties = getPropertiesFromPalette(
        toCamelCase(colorGroup.color.name),
        TonalPalette.fromInt(colorGroup.color.value),
        {
          paletteTones,
        },
      );
      return {
        ...acc,
        ...baseColorGroupProperties,
        ...lightColorGroupProperties,
        ...darkColorGroupProperties,
        ...customColorPaletteProperties,
      };
    }, {});
    return [
      {
        ...base,
        ...light,
        ...dark,
        ...palettes,
        ...customColors,
      },
    ];
  }

  return options.properties.map((ctx) => {
    const suffix = ctx?.suffix ?? '';
    const base = !ctx?.subset || ctx?.subset?.includes('scheme') ? getSchemeProperties(scheme, ctx) : {};

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

    const palettes =
      !ctx?.subset || ctx?.subset?.includes('palettes')
        ? Object.entries(theme.palettes).reduce((acc, [key, palette]) => {
            const paletteProperties = getPropertiesFromPalette(key, palette, {
              ...ctx,
              paletteTones,
            });
            return { ...acc, ...paletteProperties };
          }, {})
        : {};

    const customColors =
      !ctx?.subset || ctx?.subset?.includes('customColors')
        ? theme?.customColors.reduce((acc, colorGroup) => {
            const baseColorGroupProperties = getCustomSchemeProperties(colorGroup, {
              ...ctx,
              isDark: isDarkMode,
            });
            const lightColorGroupProperties =
              !ctx?.subset || ctx?.subset?.includes('scheme.light')
                ? getCustomSchemeProperties(colorGroup, {
                    ...ctx,
                    isDark: false,
                    suffix: `-light${suffix}`,
                  })
                : {};
            const darkColorGroupProperties =
              !ctx?.subset || ctx?.subset?.includes('scheme.dark')
                ? getCustomSchemeProperties(colorGroup, {
                    ...ctx,
                    isDark: true,
                    suffix: `-dark${suffix}`,
                  })
                : {};
            const customColorPaletteProperties =
              !ctx?.subset || ctx?.subset?.includes('palettes')
                ? getPropertiesFromPalette(
                    toCamelCase(colorGroup.color.name),
                    TonalPalette.fromInt(colorGroup.color.value),
                    {
                      ...ctx,
                      paletteTones,
                    },
                  )
                : {};
            return {
              ...acc,
              ...baseColorGroupProperties,
              ...lightColorGroupProperties,
              ...darkColorGroupProperties,
              ...customColorPaletteProperties,
            };
          }, {})
        : {};

    return { ...base, ...light, ...dark, ...palettes, ...customColors };
  });
}

const getPropertiesFromPalette = (
  name: string,
  palette: TonalPalette,
  options: PropertiesConfig['properties'][number] & {
    paletteTones: PropertiesConfig['paletteTones'];
  },
) => {
  const properties = {} as Record<string, string | number>;
  const prefix = options?.prefix ?? '';
  const suffix = options?.suffix ?? '';
  const paletteTones = options?.paletteTones ?? TONES_DEFAULT;
  const paletteKey = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  for (const tone of paletteTones) {
    const token = `${prefix}${paletteKey}-${tone}`;
    properties[`--${token}${suffix}`] =
      options?.transform && typeof options.transform === 'function'
        ? options.transform(palette.tone(tone))
        : hexFromArgb(palette.tone(tone));
  }
  return properties;
};

export function toStyleTextContent(props: ReturnType<typeof cssPropertiesFromTheme>) {
  return props
    .map((propertyKeyValue) =>
      Object.entries(propertyKeyValue)
        .map(([name, value]) => {
          return `${name}: ${value};`;
        })
        .join(''),
    )
    .join('');
}
