import {LAST_AIRDROP_KEY, AIRDROP_TIMEOUT_MS} from '../constants';

/**
 * Saves the last airdrop info in local storage
 */
export const saveLastAirdropInfo = (): void => {
  localStorage.setItem(LAST_AIRDROP_KEY, new Date().getTime().toString());
};

/**
 * Checks if airdrop is available
 *
 * @returns {boolean} boolean value indicating if airdrop is available
 */
export const checkIfCanRequestAirdrop = (): boolean => {
  const timeToNextAllowedAirdrop = getTimeToNextAllowedAirdrop();
  return timeToNextAllowedAirdrop > 0 ? false : true;
};

/**
 * Returns time in ms to next allowed airdrop
 *
 * @returns {number} number representing time in ms to next allowed airdrop
 */
export const getTimeToNextAllowedAirdrop = (): number => {
  const now = Date.now();
  const lastAirdropTimestamp = +(localStorage.getItem(LAST_AIRDROP_KEY) || 0);
  const timeToNextAllowedAirdrop = lastAirdropTimestamp + AIRDROP_TIMEOUT_MS - now;
  return timeToNextAllowedAirdrop;
};

/**
 * Returns the next allowed airdrop in date or string format
 *
 * @param {boolean} toDate Boolean value indicating if the date should be returned as string or Date object
 * @returns {Date|string} date or string representing the next allowed airdrop
 */
export const getDateOfNextAllowedAirdrop = <B extends boolean = false>(
  toDate?: B
): B extends true ? Date : string => {
  const now = Date.now();
  if (checkIfCanRequestAirdrop()) {
    return (toDate ? new Date(now) : 'Now') as B extends true ? Date : string;
  }
  const lastAirdropTimestamp = +(localStorage.getItem(LAST_AIRDROP_KEY) || 0);
  const airdropAvailableDate = new Date(lastAirdropTimestamp + AIRDROP_TIMEOUT_MS);
  return (
    toDate
      ? airdropAvailableDate
      : airdropAvailableDate.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short'
        })
  ) as B extends true ? Date : string;
};
