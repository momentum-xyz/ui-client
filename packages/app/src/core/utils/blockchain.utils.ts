import BN from 'bn.js';

const lookup = [
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

export const formatBigInt = (input: string | null | undefined, digits = 2): string => {
  if (!input || input === '0') {
    return '0';
  }

  const inputSliced = input.slice(0, -18);
  const balance = new BN(inputSliced);

  const lookupItem = lookup.find((i) => {
    return balance.gte(i.value);
  });

  if (!lookupItem) {
    return balance.toString();
  }

  return balance.div(lookupItem.value).toNumber().toFixed(digits) + lookupItem.symbol;
};
