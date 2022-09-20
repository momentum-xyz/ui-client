import styled from 'styled-components';

export const Emoji = styled.div`
  width: 32px;
  height: 32px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;

  :hover {
    background: rgba(255, 255, 255, 10%);
  }
`;

export const EmojiImg = styled.img`
  width: 100%;
  height: 100%;
`;
