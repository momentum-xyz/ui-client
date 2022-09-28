import styled from 'styled-components';
import {rgba} from 'polished';

export const Background = styled.div<{background: string}>`
  --icon-offset: 15px;

  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url(${(props) => props.background});
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1;

  .youtube {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .youtubeIframe {
    width: 100%;
    height: 100%;
  }
`;

export const Wrapper = styled.div`
  position: relative;
  width: 80%;
  height: 80%;
`;

export const CloseButton = styled.div`
  position: absolute;
  top: -28px;
  right: 0;
`;

export const ContinueButton = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: -50px;
  right: 0;
  left: 0;
`;

export const MessageWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: -50px;
  right: 0;
  left: 0;
`;

export const Message = styled.div`
  display: flex;
  padding: 0 50px;
  height: 30px;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.accent};
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  border-radius: 8px;
`;

export const PlayMessage = styled.div`
  position: absolute;
  display: flex;
  padding: 8px 14px;
  border-radius: 8px;
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  top: calc(50% + 40px);
  left: calc(50% - 72px);
  z-index: 2;
`;
