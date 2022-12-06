export const formatTokenAmount = (
  value: number,
  config = {
    useGrouping: false,
    minimumFractionDigits: 1,
    maximumFractionDigits: 4
  }
) => value.toLocaleString('de-DE', config);
