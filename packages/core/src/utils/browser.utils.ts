import {detect} from 'detect-browser';

import {BrowserEnum, AllowedBrowserEnumList} from '../enums';

// TODO: Move to core package
export const isBrowserSupported = (): boolean => {
  const browser = detect();
  if (!browser?.name) {
    return false;
  }

  try {
    return AllowedBrowserEnumList.includes(browser.name as BrowserEnum);
  } catch {
    return false;
  }
};
