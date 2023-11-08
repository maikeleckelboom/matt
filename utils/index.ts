import { Blend, type CustomColorGroup, TonalPalette } from '@material/material-color-utilities';

function toCamelCase(input: string): string {
  if (!input.trim()) {
    return '';
  }

  const words: string[] = input.split(/[^a-zA-Z0-9]+/);
  const result: string = words
    .map((word: string, index: number) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  return result;
}

function paletteFromCustomColor(
  customColor: CustomColorGroup,
  {
    tones,
    sourceColor,
  }: {
    tones: number[];
    sourceColor: number;
  },
) {
  let tonalPalette = TonalPalette.fromInt(customColor.color.value);
  if (customColor.color.blend) {
    const harmonized = Blend.harmonize(customColor.color.value, sourceColor);
    tonalPalette = TonalPalette.fromInt(harmonized);
  }
  tones.forEach((tone) => tonalPalette.tone(tone));
  return tonalPalette;
}

export { toCamelCase, paletteFromCustomColor };
