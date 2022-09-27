export const copyToClipboard = (value: string) => {
  return navigator.clipboard.writeText(value);
};
