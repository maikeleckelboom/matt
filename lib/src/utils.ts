const toCamelCase = (input: string) =>
  input
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('');

export { toCamelCase };
