/**
 * Transform string to string in "0x218...8236f" format
 *
 * @param {string} sourceString The string to convert
 * @param {number} startSymbols Count of symbols in the start
 * @param {number} endSymbols Count of symbols in the end
 * @returns {string} The string is transformed to "0x218...8236f" format
 */
export const doThreeDotsInside = (
  sourceString: string,
  startSymbols: number,
  endSymbols: number
): string => {
  return startSymbols + endSymbols < sourceString.length
    ? `${sourceString.slice(0, startSymbols)}...${sourceString.slice(-1 * endSymbols)}`
    : sourceString;
};
