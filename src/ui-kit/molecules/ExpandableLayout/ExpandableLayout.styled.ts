import {rgba} from 'polished';
import styled from 'styled-components';

import {ComponentSizeInterface} from 'ui-kit/interfaces';

export const Container = styled.div<ComponentSizeInterface>`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  pointer-events: all;
  overflow: hidden;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  backdrop-filter: blur(10px);

  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => props.maxWidth && `max-width: ${props.maxWidth};`}
  ${(props) => props.maxHeight && `max-height: ${props.maxHeight};`}

  &.expanded {
    margin-bottom: 10px;
  }

  :not(&.exanded) {
    height: 43px;
  }

  &.fullHeight {
    height: calc(100vh - 70px - 10px);
  }

  :not(&.fullHeight) {
    height: max-content;
    max-height: 100%;
  }
`;

export const ToggleHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 10px;
  cursor: pointer;
`;

export const ToggleHeaderInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const ToggleContainer = styled.div`
 .IconSvg-custom {
   opacity: 0.5;
 }

  &.expanded {
    .IconSvg-custom {
      svg {
        transform: rotate(180deg);
      }
    }
  }
`;
