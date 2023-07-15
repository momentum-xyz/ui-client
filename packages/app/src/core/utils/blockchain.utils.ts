import {TokenEnum} from '@momentum-xyz/core';
import BN from 'bn.js';

import {StorageKeyEnum} from 'core/enums';
import {storage} from 'shared/services';

export const AIRDROP_TIMEOUT_MS = 24 * 60 * 60 * 1000;

const LOOKUP = [
  {value: new BN('1000'), symbol: 'k'}, // kilo
  {value: new BN('1000000'), symbol: 'M'}, // mega
  {value: new BN('1000000000'), symbol: 'G'}, // giga
  {value: new BN('1000000000000'), symbol: 'T'}, // tera
  {value: new BN('1000000000000000'), symbol: 'P'}, // peta
  {value: new BN('1000000000000000000'), symbol: 'E'}, // exa
  {value: new BN('1000000000000000000000'), symbol: 'Z'}, // zetta
  {value: new BN('1000000000000000000000000'), symbol: 'Y'}, // yotta
  {value: new BN('1000000000000000000000000000'), symbol: 'R'}, // ronna
  {value: new BN('1000000000000000000000000000000'), symbol: 'Q'} // quetta
].reverse();

export const formatBigInt = (input: string | null | undefined, digits = 6): string => {
  if (!input || input === '0') {
    return '0';
  }

  const inputSliced = input.slice(0, -18);
  const balance = new BN(inputSliced);

  const lookupItem = LOOKUP.find((i) => {
    return balance.gte(i.value);
  });

  // The number is less than 1000. It will without symbol
  if (!lookupItem) {
    const resultSmallValue = new BN(input).div(new BN('1000000000000000000'));

    let valueDigits = input.slice(-18);
    if (valueDigits.length < 18) {
      // Digits value must have 18 characters, but may contain less.
      valueDigits = `${Array(18 - valueDigits.length + 1).join('0')}${valueDigits}`;
    }

    return `${resultSmallValue.toString()}.${valueDigits.slice(0, digits)}`;
  }

  const resultValue = balance.div(lookupItem.value);
  return `${resultValue}.${input.slice(-18).slice(0, digits)}${lookupItem.symbol}`;
};

export const convertUuidToNftId = (worldId: string | undefined | null) => {
  return worldId ? '0x' + worldId.replace(/-/g, '') : '';
};

/**
 * Saves the last airdrop info in local storage
 */
export const saveLastAirdropInfo = (wallet: string): void => {
  storage.setString(`${StorageKeyEnum.LastAirdrop}_${wallet}`, new Date().getTime().toString());
};

/**
 * Checks if airdrop is available
 *
 * @returns {boolean} boolean value indicating if airdrop is available
 */
export const checkIfCanRequestAirdrop = (wallet: string): boolean => {
  const timeToNextAllowedAirdrop = getTimeToNextAllowedAirdrop(wallet);
  return timeToNextAllowedAirdrop > 0 ? false : true;
};

/**
 * Returns time in ms to next allowed airdrop
 *
 * @returns {number} number representing time in ms to next allowed airdrop, 0 if airdrop is available
 */
export const getTimeToNextAllowedAirdrop = (wallet: string): number => {
  const now = Date.now();
  const key = `${StorageKeyEnum.LastAirdrop}_${wallet}`;
  const lastAirdropTimestamp = +(storage.get<string>(key) || 0);
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
  wallet: string,
  toDate?: B
): B extends true ? Date : string => {
  const now = Date.now();
  const timeToNextAllowedAirdrop = getTimeToNextAllowedAirdrop(wallet);
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

export const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export const tokenKindToSymbol = (kind: TokenEnum): string => {
  return kind === TokenEnum.MOM_TOKEN ? 'MOM' : 'DAD';
};
