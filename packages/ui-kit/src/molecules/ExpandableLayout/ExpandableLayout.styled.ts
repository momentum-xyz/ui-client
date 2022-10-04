import {rgba} from 'polished';
import styled from 'styled-components';

import {IconSvg} from '../../atoms';
import {ComponentSizeInterface} from '../../interfaces';

export const ChevronIconSvg = styled(IconSvg)``;

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
    height: calc(100vh - 80px);
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
  ${ChevronIconSvg} {
    opacity: 0.5;
  }

  &.expanded {
    ${ChevronIconSvg} {
      svg {
        transform: rotate(180deg);
      }
    }
  }
`;
