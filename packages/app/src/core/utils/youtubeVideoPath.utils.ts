export const youtubeVideoPath = (url: string, defaultValue: any): string => {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regex);
  return match && match[7].length === 11 ? match[7] : defaultValue;
};

export const youtubeVideoFullPath = (url: string, defaultValue: any): string => {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regex);
  return match && match[7].length === 11
    ? `https://www.youtube.com/embed/${match[7]}`
    : `https://www.youtube.com/embed/${defaultValue}`;
};

export const youtubeVideoHash = (url: string, defaultValue: any): string => {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regex);
  return match && match[7].length === 11
    ? match[7]
    : `https://www.youtube.com/embed/${defaultValue}`;
};
