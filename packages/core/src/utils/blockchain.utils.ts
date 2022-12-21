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
 * @returns {number} number representing time in ms to next allowed airdrop, 0 if airdrop is available
 */
export const getTimeToNextAllowedAirdrop = (): number => {
  const now = Date.now();
  const lastAirdropTimestamp = +(localStorage.getItem(LAST_AIRDROP_KEY) || 0);
  const timeToNextAllowedAirdrop = lastAirdropTimestamp + AIRDROP_TIMEOUT_MS - now;
  return timeToNextAllowedAirdrop > 0 ? timeToNextAllowedAirdrop : 0;
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
  const timeToNextAllowedAirdrop = getTimeToNextAllowedAirdrop();
  const canRequestAirdrop = timeToNextAllowedAirdrop <= 0;
  if (canRequestAirdrop) {
    return (toDate ? new Date(now) : 'Now') as B extends true ? Date : string;
  }
  const airdropAvailableDate = new Date(timeToNextAllowedAirdrop + now);
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
