import styled from 'styled-components';

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const Image = styled.img`
  width: 24px;
  height: 24px;
`;

export const Link = styled.a`
  font-size: var(--font-size-m);
  color: var(--white);

  &:hover {
    color: ${(props) => props.theme.accent};
  }
`;

export const Numbers = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
