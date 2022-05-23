import styled from 'styled-components';

export const Container = styled.div`
  display: block-inline;
  gap: 3px;
`;

export const Header = styled.span`
  color: ${(props) => props.theme.accent};
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  text-align: left;
  &.bold {
    font-weight: bold;
  }
  &.notBold {
    font-weight: normal;
  }
`;

export const TextHeader = styled.span`
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xl);
  font-weight: normal;
  text-transform: uppercase;
  text-align: left;
`;
