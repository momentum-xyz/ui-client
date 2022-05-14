export const youtubeVideoPath = (url: string, defaultValue: any): string => {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const match = url.match(regex);
  return match && match[7].length === 11 ? match[7] : defaultValue;
};
