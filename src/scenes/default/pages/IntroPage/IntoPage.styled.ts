import styled from 'styled-components';

export const Background = styled.div<{background: string}>`
  --icon-offset: 15px;

  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-color: var(--black);
  align-items: end;
  justify-content: center;
  z-index: 1;

  .youtube {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: end;
  }

  .youtubeIframe {
    width: 100%;
    height: calc(100% - 50px);
  }
`;

export const CloseIcon = styled.div`
  position: absolute;
  top: var(--icon-offset);
  right: var(--icon-offset);
  z-index: 2;
`;
