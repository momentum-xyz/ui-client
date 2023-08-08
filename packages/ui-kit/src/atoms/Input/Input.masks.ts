import IMask from 'imask';

export const stringInputMask: IMask.AnyMaskedOptions = {
  mask: String
};

export const numberInputMask = (scale = 0, signed = false): IMask.MaskedNumberOptions => {
  return IMask.createMask({
    mask: Number,
    scale: scale, // digits after point
    signed: signed, // allow or disallow negative
    radix: '.', // fractional delimiter
    thousandsSeparator: ' '
  });
};

export const numberInputPrefixMask = (
  prefix: string,
  scale = 0,
  signed = false
): IMask.MaskedPatternOptions => {
  return IMask.createMask({
    mask: `${prefix} unit`,
    blocks: {
      unit: {
        mask: Number,
        scale: scale,
        signed: signed,
        radix: '.',
        thousandsSeparator: ' '
      }
    }
  });
};

export const numberInputSuffixMask = (
  suffix: string,
  scale = 0,
  signed = false,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER
): IMask.AnyMaskedOptions => {
  return IMask.createMask({
    mask: `unit ${suffix}`,
    blocks: {
      unit: {
        mask: Number,
        max: max,
        min: min,
        scale: scale,
        signed: signed,
        radix: '.',
        thousandsSeparator: ' '
      }
    }
  });
};
