import styled from 'styled-components';

export const Wrapper = styled.span`
  --icon-size-xxl: 40px;
  --icon-size-xll: 32px;
  --icon-size-xl2: 24px;
  --icon-size-xl: 20px;
  --icon-size-l: 18px;
  --icon-size-m: 16px;
  --icon-size-s: 14px;
  --icon-size-xs: 12px;
  --icon-size-xxs: 11px;

  display: block;
  flex-shrink: 0;
  color: ${(props) => props.theme.accentBg};

  &.danger {
    color: ${(props) => props.theme.danger};
  }

  &.accent {
    color: ${(props) => props.theme.accentText};
  }

  /* VARIANTS */

  &.white {
    color: var(--white) !important;
  }

  /* SIZES */

  &.xxs {
    width: var(--icon-size-xxs);
    height: var(--icon-size-xxs);
  }

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

  &.xl2 {
    width: var(--icon-size-xl2);
    height: var(--icon-size-xl2);
  }

  &.xxl {
    width: var(--icon-size-xxl);
    height: var(--icon-size-xxl);
  }

  &.xll {
    width: var(--icon-size-xll);
    height: var(--icon-size-xll);
  }

  /* STATES */

  &.disabled {
    opacity: 0.3;
  }
`;

export const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
`;
