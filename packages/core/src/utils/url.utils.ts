/**
 * Generates absoulute link from a string by adding "https://" prefix if needed.
 *
 * @param {string} urlString string with url
 * @returns {string} `urlString` with "https://" prefix if `urlString` did not have it
 */
export const absoluteLink = (urlString: string) => {
  return urlString.startsWith('http://') || urlString.startsWith('https://')
    ? urlString
    : `https://${urlString}`;
};

/**
 * Strips an url from prorocol part ("http://" or "https://"")
 *
 * @param {string} urlString string with url
 * @returns {string} `urlString` striped out of protocol
 */
export const withoutProtocol = (urlString: string) => {
  return urlString.replace(/^https?:\/\//, '');
};
