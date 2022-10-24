import styled from 'styled-components';

export const Wrapper = styled.span`
  --icon-size-small: 12px;
  --icon-size-normal: 14px;
  --icon-size-medium: 16px;
  --icon-size-medium-large: 20px;
  --icon-size-large: 24px;
  --icon-size-normal-large: 32px;
  --icon-size-extra-large: 40px;
  --icon-size-super-large: 87px;
  --icon-size-huge: 140px;

  display: block;
  flex-shrink: 0;
  color: ${(props) => props.theme.accent};

  &.danger {
    color: ${(props) => props.theme.accentDanger};
  }

  /* VARIANTS */

  &.white {
    color: var(--white) !important;
  }

  /* SIZES */

  &.small {
    width: var(--icon-size-small);
    height: var(--icon-size-small);
  }

  &.extra-large {
    width: var(--icon-size-extra-large);
    height: var(--icon-size-extra-large);
  }

  &.large {
    width: var(--icon-size-large);
    height: var(--icon-size-large);
  }

  &.normal {
    width: var(--icon-size-normal);
    height: var(--icon-size-normal);
  }

  &.medium {
    width: var(--icon-size-medium);
    height: var(--icon-size-medium);
  }

  &.medium-large {
    width: var(--icon-size-medium-large);
    height: var(--icon-size-medium-large);
  }

  &.normal-large {
    width: var(--icon-size-normal-large);
    height: var(--icon-size-normal-large);
  }

  &.super-large {
    width: var(--icon-size-super-large);
    height: var(--icon-size-super-large);
  }

  &.huge {
    width: var(--icon-size-huge);
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
