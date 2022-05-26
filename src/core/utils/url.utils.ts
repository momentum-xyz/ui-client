export const absoluteLink = (urlString: string) => {
  return urlString.startsWith('http://') || urlString.startsWith('https://')
    ? urlString
    : `https://${urlString}`;
};
