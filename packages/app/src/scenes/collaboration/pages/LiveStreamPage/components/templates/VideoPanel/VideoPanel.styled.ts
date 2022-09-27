import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  overflow: hidden;

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
