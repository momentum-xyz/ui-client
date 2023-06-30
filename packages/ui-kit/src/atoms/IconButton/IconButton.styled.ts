import styled from 'styled-components';

export const Button = styled.button`
  opacity: 1;
  transition: opacity var(--tr-100-ei);

  &:hover {
    opacity: 0.7;
  }

  &.disabled {
    &:hover {
      cursor: not-allowed;
      opacity: 1;
    }
  }
`;
