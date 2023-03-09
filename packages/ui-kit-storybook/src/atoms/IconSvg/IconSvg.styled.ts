import styled from 'styled-components';

export const Wrapper = styled.span`
  --icon-size-xl: 20px;
  --icon-size-l: 18px;
  --icon-size-m: 16px;
  --icon-size-s: 14px;
  --icon-size-xs: 12px;

  display: block;
  flex-shrink: 0;
  color: ${(props) => props.theme.accentBg};

  &.danger {
    color: ${(props) => props.theme.danger};
  }

  /* VARIANTS */

  &.white {
    color: var(--white) !important;
  }

  /* SIZES */

  &.xs {
    width: var(--icon-size-xs);
    height: var(--icon-size-xs);
  }

  &.s {
    width: var(--icon-size-s);
    height: var(--icon-size-s);
  }

  &.m {
    width: var(--icon-size-m);
    height: var(--icon-size-m);
  }

  &.l {
    width: var(--icon-size-l);
    height: var(--icon-size-l);
  }

  &.xl {
    width: var(--icon-size-xl);
    height: var(--icon-size-xl);
  }

  /* STATES */

  &.disabled {
    opacity: 0.2;
  }
`;

export const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
`;
