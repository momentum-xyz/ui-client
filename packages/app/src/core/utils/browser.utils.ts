import {detect} from 'detect-browser';

import {BrowserEnum, BrowserEnumList} from 'core/enums';

export const isBrowserSupported = (): boolean => {
  const browser = detect();
  if (!browser?.name) {
    return false;
  }

  try {
    return BrowserEnumList.includes(browser.name as BrowserEnum);
  } catch {
    return false;
  }
};
