import { BN, BN_TEN, BN_THOUSAND, formatBalance } from "@polkadot/util";

export const formatExistential = (value: BN): string => {
  console.log(value);
  let fmt = (
    value
      .mul(BN_THOUSAND)
      .div(BN_TEN.pow(new BN(formatBalance.getDefaults().decimals)))
      .toNumber() / 1000
  ).toFixed(3);

  while (fmt.length !== 1 && ['.', '0'].includes(fmt[fmt.length - 1])) {
    const isLast = fmt.endsWith('.');

    fmt = fmt.substr(0, fmt.length - 1);

    if (isLast) {
      break;
    }
  }

  return fmt;
};