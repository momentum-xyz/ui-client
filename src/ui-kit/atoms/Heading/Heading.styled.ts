import styled from 'styled-components';

export const Heading = styled.div`
  color: ${(props) => props.theme.accent};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  .uppercase {
    text-transform: uppercase;
  }

  .lowercase {
    text-transform: lowercase;
  }

  .normal {
    text-transform: none;
  }

  .capitalized {
    text-transform: capitalize;
  }

  &.danger {
    color: ${(props) => props.theme.accentDanger};
  }

  &.left {
    text-align: left;
  }

  &.right {
    text-align: right;
  }

  &.center {
    text-align: center;
  }

  &.light {
    font-weight: lighter;
  }

  &.normal {
    font-weight: normal;
  }

  &.bold {
    font-weight: bold;
  }

  &.bolder {
    font-weight: bolder;
  }
`;

export const H1 = styled.h1`
  font-size: var(--font-size-xl);
`;

export const H2 = styled.h2`
  font-size: var(--font-size-l);
`;

export const H3 = styled.h3`
  font-size: var(--font-size-s);
`;

export const H4 = styled.h4`
  font-size: var(--font-size-xs);
`;

export const H5 = styled.h5`
  font-size: var(--font-size-xxs);
`;
