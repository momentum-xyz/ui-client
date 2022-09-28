import {BN, BN_TEN, BN_ZERO, formatBalance, isUndefined} from '@polkadot/util';
import {SiDef} from '@polkadot/util/types';

const getSiPowers = (si: SiDef | null, decimals?: number): [BN, number, number] => {
  if (!si) {
    return [BN_ZERO, 0, 0];
  }

  const basePower = isUndefined(decimals) ? formatBalance.getDefaults().decimals : decimals;

  return [new BN(basePower + si.power), basePower, si.power];
};

export const inputToBN = (
  input: string,
  chainDecimals: number | undefined,
  tokenSymbol: string
): [BN, boolean] => {
  formatBalance.setDefaults({
    decimals: chainDecimals,
    unit: tokenSymbol
  });
  const si = formatBalance.findSi('-');
  const [siPower, basePower, siUnitPower] = getSiPowers(si);

  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);

  let result;

  if (isDecimalValue) {
    if (siUnitPower - isDecimalValue[2].length < -basePower) {
      result = new BN(-1);
    }

    const div = new BN(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '').substr(0, chainDecimals);
    const mod = new BN(modString);

    result = div
      .mul(BN_TEN.pow(siPower))
      .add(mod.mul(BN_TEN.pow(new BN(basePower + siUnitPower - modString.length))));
  } else {
    result = new BN(input.replace(/[^\d]/g, '')).mul(BN_TEN.pow(siPower));
  }

  // @ts-ignore
  return result;
};
