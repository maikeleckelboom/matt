// function toCamelCase(input: string): string {
//   if (!input.trim()) {
//     return '';
//   }
//   const words: string[] = input.split(/[^a-zA-Z0-9]+/);
//   return words
//     .map((word: string, index: number) => {
//       if (index === 0) {
//         return word.toLowerCase();
//       }
//       return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//     })
//     .join('');
// }
const toCamelCase = (input: string) =>
  input
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');

export { toCamelCase };
