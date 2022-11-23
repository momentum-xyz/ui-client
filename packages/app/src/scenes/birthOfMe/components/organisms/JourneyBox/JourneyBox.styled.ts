import styled from 'styled-components';

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Image = styled.img`
  width: 100%;
`;

export const Link = styled.a`
  font-size: var(--font-size-m);
  color: #ffffff;

  &:hover {
    color: ${(props) => props.theme.accent};
  }
`;
