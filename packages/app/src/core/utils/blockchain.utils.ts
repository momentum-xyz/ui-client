import BN from 'bn.js';

export const formatBigInt = (input: string | null | undefined, digits = 2): string => {
  if (!input || input === '0') {
    return '0';
  }

  const inputSliced = input.slice(0, -18);
  const balance = new BN(inputSliced);

  const lookup = [
    {value: '0', symbol: ''},
    {value: '1000', symbol: 'k'}, // kilo
    {value: '1000000', symbol: 'M'}, // mega
    {value: '1000000000', symbol: 'G'}, // giga
    {value: '1000000000000', symbol: 'T'}, // tera
    {value: '1000000000000000', symbol: 'P'}, // peta
    {value: '1000000000000000000', symbol: 'E'}, // exa
    {value: '1000000000000000000000', symbol: 'Z'}, // zetta
    {value: '1000000000000000000000000', symbol: 'Y'}, // yotta
    {value: '1000000000000000000000000000', symbol: 'R'}, // ronna
    {value: '1000000000000000000000000000000', symbol: 'Q'} // quetta
  ];

  const lookupItem = lookup.reverse().find((i) => {
    return balance.gte(new BN(i.value));
  });

  if (!lookupItem) {
    return balance.toString();
  }

  return balance.div(new BN(lookupItem.value)).toNumber().toFixed(digits) + lookupItem.symbol;
};
