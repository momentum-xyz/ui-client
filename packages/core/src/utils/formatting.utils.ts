// TODO move to nftStore
export const formatTokenAmount = (
  value: number,
  chainDecimals = 12,
  tokenSymbol = 'MTM',
  config = {
    useGrouping: false,
    minimumFractionDigits: 1,
    maximumFractionDigits: 4
  }
): string => {
  const tokenVal = value / Math.pow(10, chainDecimals);
  return `${tokenVal.toLocaleString('de-DE', config)} ${tokenSymbol}`;
};
