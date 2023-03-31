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
  color: ${(props) => props.theme.text};

  &:hover {
    color: ${(props) => props.theme.accent};
  }
`;

export const Numbers = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const Container = styled.div``;
export const Separator = styled.div`
  border-top: 2px solid #9eeeff;
  margin: 10px 0;
`;
export const SignUpMethodsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const SignUpMethodContainer = styled.button`
  width: 92px;
  height: 102px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px, 6px, 10px, 6px;
  margin: 0 17px 20px;

  background: rgba(0, 67, 115, 0.4);
  border: 1px solid rgba(158, 238, 255, 0.6);

  & > span {
    font-family: Poppins;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0.08em;
    text-align: center;
    color: #ffffff;
  }

  & > img {
    max-width: 64px;
    margin-bottom: 4px;
  }
`;
