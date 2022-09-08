export const splitIntoSentences = (text: string, preseringWhiteSpaces = true) => {
  if (preseringWhiteSpaces) {
    return text.match(/([^.,;:?]|[\n\r\s])+[.,;:?]*/g);
  } else {
    return text.match(/([^.,;:?])+[.,;:?]*/g);
  }
};

export const splitIntoFirstNSentencesAndRest = (
  text: string,
  n: number,
  preseringWhiteSpaces = true
) => {
  const sentences = splitIntoSentences(text, preseringWhiteSpaces);

  if (!sentences) {
    return [];
  }

  const firstSentences = sentences.filter((sentence, index) => {
    return index < n;
  });

  const rest = sentences.filter((sentence, index) => {
    return index >= n;
  });

  return [firstSentences, rest];
};

/**
 * Transforms text into slugified text, meaning text that contains only [a-z], [0-9] or '-' characters.
 * Replaces whitespace with '-' character.
 *
 * @param text Text that needs to be slugified
 * @returns Slugified text that contains only [a-z], [0-9] or '-' characters.
 */
export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/[_]+/g, '');
};

export const truncateText = (text: string, textLength: number) => {
  return `${text.slice(0, textLength)} ${text.length > textLength ? '...' : ''}`;
};
