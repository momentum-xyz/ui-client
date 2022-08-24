import styled from 'styled-components';

export const VideoPanel = styled.div`
  width: 100%;
  height: 40vh;
  z-index: calc(var(--dialog-z-index) + 1);
`;
export const Body = styled.div`
  display: flex;
  align-items: start;
  pointer-events: auto;

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

export const ButtonWrapper = styled.div`
  display: flex;
  position: absolute;
  padding-top: 41vh;
  width: 100%;
  justify-content: center;
`;
