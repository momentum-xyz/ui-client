import styled from 'styled-components';
import {rgba} from 'polished';

import {VideoPanel} from 'ui-kit';

export const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // align-items: top;
  // justify-content: top;
  overflow: hidden;
  border-radius: 10px;
  width: 695px;
  height: 360px;
  cursor: pointer;
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.8)};
  z-index: 100;
  left: 240px;
  bottom: 60px;
`;

export const HeaderElement = styled.div`
  padding: 5px 10px;
  opacity: 0.8;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  gap: 20px;
  top: 0;

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
`;

export const VideoPanelStyled = styled(VideoPanel)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export const VideoWrapper = styled.div`
  height: 90%;
  width: 100%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;
