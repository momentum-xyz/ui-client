import styled from 'styled-components';

export const Heading = styled.div`
  &.variant-h1 {
    font-size: var(--font-size-xxl);
    font-weight: 400;
    line-height: normal;
    letter-spacing: 5.4px;
    text-transform: uppercase;
  }

  &.variant-h2 {
    font-size: var(--font-size-xl);
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 3.2px;
    text-transform: uppercase;
  }

  &.variant-h3 {
    font-size: var(--font-size-l);
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  &.variant-h4 {
    font-size: var(--font-size-s);
    font-weight: 600;
    line-height: 18px;
    letter-spacing: 1.3px;
    text-transform: uppercase;
  }
`;
