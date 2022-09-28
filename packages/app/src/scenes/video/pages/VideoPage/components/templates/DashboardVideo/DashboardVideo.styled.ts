import styled from 'styled-components';

export const Container = styled.div`
  --icon-offset: 15px;

  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
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

export const CloseButton = styled.div`
  position: absolute;
  top: -28px;
  right: 0;
`;

export const Wrapper = styled.div`
  position: relative;
  width: 80%;
  height: 80vh;
`;
