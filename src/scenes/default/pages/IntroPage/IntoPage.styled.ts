import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  padding: 0 12px;
  width: 100%;
  height: 50px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Background = styled.div`
  --icon-offset: 15px;

  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background: ${(props) => props.theme.bg};
  align-items: end;
  justify-content: center;
  flex-direction: column;
  z-index: 1;

  .youtube {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: end;
  }

  .youtubeIframe {
    width: 100%;
    height: 100%;
  }
`;
