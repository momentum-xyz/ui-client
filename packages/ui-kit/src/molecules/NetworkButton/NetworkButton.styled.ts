import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  flex-direction: column;
  grid-gap: 10px;
  background: initial;
  border: none;
  transition: opacity var(--tr-100-ei);
  color: ${(props) => props.theme.text};

  &:hover {
    color: ${(props) => props.theme.accent};
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const Image = styled.img`
  width: 36px;
  height: 36px;
`;

export const Label = styled.div`
  color: inherit;
  font-size: var(--font-size-xxs);
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-weight: 500;
`;
