export const splitIntoSentences = (text: string, preseringWhiteSpaces = true) => {
  if (preseringWhiteSpaces) {
    return text.match(/([\w\r\n\s])+[.,;:?"']*/g);
  } else {
    return text.match(/([\w])+[.,;:?"']*/g);
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
