import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-s);
  gap: 10px;
`;

export const Stars = styled.div`
  display: flex;
  color: ${(props) => props.theme.text};
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const Link = styled.a`
  color: ${(props) => props.theme.text};
  text-decoration: underline;
  transition: opacity var(--tr-100-ei);

  &:hover {
    cursor: pointer;
    text-decoration: none;
    opacity: 0.8;
  }
`;
