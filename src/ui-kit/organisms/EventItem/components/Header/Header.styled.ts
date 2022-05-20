import styled from 'styled-components';

export const Container = styled.div`
  display: block-inline;
  gap: 3px;
`;

export const Header = styled.div``;
export const BoldHeader = styled.span`
  color: ${(props) => props.theme.accent};
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  font-weight: bold;
  text-align: left;
  &.notBold {
    font-weight: normal;
  }
`;

export const NormalHeader = styled.span`
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  font-weight: normal;
  text-align: left;
`;
