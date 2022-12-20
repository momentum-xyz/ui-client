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
 * @param {boolean} toString Boolean value indicating if the date should be returned as string
 * @returns {Date|string} date or string representing the next allowed airdrop
 */
export const getDateOfNextAllowedAirdrop = (toString = true): Date | string => {
  const now = Date.now();
  const lastAirdropTimestamp = +(localStorage.getItem(LAST_AIRDROP_KEY) || 0);
  if (checkIfCanRequestAirdrop()) {
    return toString ? 'Now' : new Date(now);
  }
  const airdropAvailableDate = new Date(lastAirdropTimestamp + AIRDROP_TIMEOUT_MS);
  return toString
    ? airdropAvailableDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      })
    : airdropAvailableDate;
};
