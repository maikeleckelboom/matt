import {
  type CustomColorGroup,
  hexFromArgb,
  Scheme,
  type Theme,
  TonalPalette,
} from '@material/material-color-utilities';
import { toCamelCase } from './utils';
import type { PropertyFormatOptions, ThemePropertiesConfig } from '~/lib/package/types';
import { PALETTE_TONES_DEFAULT } from '~/lib/package/constants';

function propertiesFromScheme(scheme: Scheme, options?: PropertyFormatOptions) {
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

function propertiesFromCustomColorGroup(
  customColorGroup: CustomColorGroup,
  options: PropertyFormatOptions & {
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

function propertiesFromTheme(
  theme: Theme,
  options?: ThemePropertiesConfig,
): Record<string, string | number>[] {
  const tones = options?.paletteTones ?? PALETTE_TONES_DEFAULT;
  const isDark = options?.isDark ?? false;
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

  if (!options?.properties?.length) {
    const base = propertiesFromScheme(scheme);
    const light = propertiesFromScheme(theme.schemes.light, { suffix: '-light' });
    const dark = propertiesFromScheme(theme.schemes.dark, { suffix: '-dark' });
    const palettes = Object.entries(theme.palettes).reduce((acc, [key, palette]) => {
      const paletteProperties = propertiesFromPalette(key, palette, { tones });
      return { ...acc, ...paletteProperties };
    }, {});
    const customColors = theme?.customColors.reduce((acc, colorGroup) => {
      const baseColorGroupProperties = propertiesFromCustomColorGroup(colorGroup, { isDark });
      const lightColorGroupProperties = propertiesFromCustomColorGroup(colorGroup, {
        isDark: false,
        suffix: '-light',
      });
      const darkColorGroupProperties = propertiesFromCustomColorGroup(colorGroup, {
        isDark: true,
        suffix: '-dark',
      });
      const customColorPaletteProperties = propertiesFromPalette(
        toCamelCase(colorGroup.color.name),
        TonalPalette.fromInt(colorGroup.color.value),
        { tones },
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

    const base = !ctx?.subset || ctx?.subset?.includes('scheme') ? propertiesFromScheme(scheme, ctx) : {};

    const light =
      !ctx?.subset || ctx?.subset?.includes('scheme.light')
        ? propertiesFromScheme(theme.schemes.light, {
            ...ctx,
            suffix: `-light${suffix}`,
          })
        : {};

    const dark =
      !ctx?.subset || ctx?.subset?.includes('scheme.dark')
        ? propertiesFromScheme(theme.schemes.dark, {
            ...ctx,
            suffix: `-dark${suffix}`,
          })
        : {};

    const palettes =
      !ctx?.subset || ctx?.subset?.includes('palettes')
        ? Object.entries(theme.palettes).reduce((acc, [key, palette]) => {
            const paletteProperties = propertiesFromPalette(key, palette, {
              ...ctx,
              tones,
            });
            return { ...acc, ...paletteProperties };
          }, {})
        : {};

    const customColors =
      !ctx?.subset || ctx?.subset?.includes('customColors')
        ? theme?.customColors.reduce((acc, colorGroup) => {
            const base = propertiesFromCustomColorGroup(colorGroup, {
              ...ctx,
              isDark: isDark,
            });
            const light =
              !ctx?.subset || ctx?.subset?.includes('scheme.light')
                ? propertiesFromCustomColorGroup(colorGroup, {
                    ...ctx,
                    isDark: false,
                    suffix: `-light${suffix}`,
                  })
                : {};
            const dark =
              !ctx?.subset || ctx?.subset?.includes('scheme.dark')
                ? propertiesFromCustomColorGroup(colorGroup, {
                    ...ctx,
                    isDark: true,
                    suffix: `-dark${suffix}`,
                  })
                : {};
            const palette =
              !ctx?.subset || ctx?.subset?.includes('palettes')
                ? propertiesFromPalette(
                    toCamelCase(colorGroup.color.name),
                    TonalPalette.fromInt(colorGroup.color.value),
                    {
                      ...ctx,
                      tones,
                    },
                  )
                : {};
            return {
              ...acc,
              ...base,
              ...light,
              ...dark,
              ...palette,
            };
          }, {})
        : {};

    return { ...base, ...light, ...dark, ...palettes, ...customColors };
  });
}

const propertiesFromPalette = (
  name: string,
  palette: TonalPalette,
  options?: PropertyFormatOptions & {
    tones: ThemePropertiesConfig['paletteTones'];
  },
) => {
  const properties = {} as Record<string, string | number>;
  const prefix = options?.prefix ?? '';
  const suffix = options?.suffix ?? '';
  const paletteTones = options?.tones ?? PALETTE_TONES_DEFAULT;
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

function textFromProperties(properties: ReturnType<typeof propertiesFromTheme>) {
  return properties
    .map((property) =>
      Object.entries(property)
        .map(([name, value]) => {
          return `${name}: ${value};`;
        })
        .join(''),
    )
    .join('');
}

export {
  propertiesFromTheme,
  textFromProperties,
  propertiesFromScheme,
  propertiesFromCustomColorGroup,
  propertiesFromPalette,
};
