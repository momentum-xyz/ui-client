const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

export const absoluteLink = (urlString: string) => {
  return urlString.startsWith('http://') || urlString.startsWith('https://')
    ? urlString
    : `https://${urlString}`;
};

export const withoutProtocol = (urlString: string) => {
  return urlString.replace(/^https?:\/\//, '');
};

export const linkify = (text: string) => {
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
};
