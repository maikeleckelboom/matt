import { type CustomColor, Scheme, type Theme } from '@material/material-color-utilities';

type CustomColorHex = Omit<CustomColor, 'value'> & { value: string };

export type ThemeConfig = {
  primary: string;
  customColors: CustomColorHex[];
  options: {
    dark: boolean;
  };
  properties: {
    includes?: ('palettes' | 'dark' | 'light' | 'customColors')[];
    suffix?: string;
    prefix?: string;
    transformFn: (argb: number) => string | number;
  }[];
};

export const TONES_DEFAULT = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100] as const;

function getSchemeProperties(scheme: Scheme, options: ThemeConfig['properties'][number]) {
  const prefix = options?.prefix ?? '';
  const suffix = options?.suffix ?? '';
  const properties: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(scheme.toJSON())) {
    const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    properties[`--${prefix}${token}${suffix}`] = options.transformFn(value);
  }

  return properties;
}

export function cssVarsFromTheme(theme: Theme, options: ThemeConfig) {
  const isDark = options?.options?.dark ?? false;
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

  return options.properties.map((ctx) => {
    const baseline: Record<string, string | number> = getSchemeProperties(scheme, ctx);

    const prefix = ctx?.prefix ?? '';
    const suffix = ctx?.suffix ?? '';

    const light =
      ctx?.includes && ctx.includes.includes('light')
        ? getSchemeProperties(theme.schemes.light, {
            ...ctx,
            suffix: `-light${suffix}`,
          })
        : {};

    const dark =
      ctx?.includes && ctx.includes.includes('dark')
        ? getSchemeProperties(theme.schemes.dark, {
            ...ctx,
            suffix: `-dark${suffix}`,
          })
        : {};

    const palettes: Record<string, string | number> = {};
    if (ctx?.includes && ctx.includes.includes('palettes')) {
      for (const [key, palette] of Object.entries(theme.palettes)) {
        const paletteKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        for (const tone of TONES_DEFAULT) {
          const token = `${prefix}${paletteKey}${tone}`;
          palettes[`--${token}`] = ctx.transformFn(palette.tone(tone));
        }
      }
    }

    return {
      ...baseline,
      ...light,
      ...dark,
      ...palettes,
    };
  });
}
