export const DELAY_DEFAULT = 100;
export const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
