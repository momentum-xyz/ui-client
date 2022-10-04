import {DebouncedFunc, DebounceSettings} from 'lodash-es';
import debounce from 'lodash/debounce';
import {useCallback} from 'react';

/**
 * N.B. If you have a typed argument(s) function inside debounce callback
 * always provide outer function description and type cast,
 * type cast alone will cause runtime errors!
 */
export const useDebouncedCallback = <T extends (...args: any[]) => unknown>(
  callback: T,
  delay = 0,
  deps: unknown[] = [],
  options?: DebounceSettings
): DebouncedFunc<T> => useCallback(debounce(callback, delay, options), [...deps, delay, options]);
