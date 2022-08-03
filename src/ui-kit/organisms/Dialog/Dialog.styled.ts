import styled from 'styled-components';
import {rgba} from 'polished';

import {OffsetInterface} from 'ui-kit/interfaces';

export const Button = styled.div``;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  ${Button} ~ ${Button} {
    margin-left: 10px;
  }
`;

export const Modal = styled.div`
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: var(--dialog-z-index);
  pointer-events: none;

  &.showBackground {
    background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.3)};
    pointer-events: all;
  }

  &.opacity {
    opacity: 0.9;
  }

  &.center {
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
  }

  &.rightBottom {
    align-items: flex-end;
    justify-content: flex-end;
    bottom: 0;
    right: 0;
  }

  &.rightTop {
    align-items: flex-start;
    justify-content: flex-end;
    bottom: 0;
    right: 0;
  }

  &.leftTop {
    align-items: flex-start;
    justify-content: flex-start;
    top: 0;
    left: 0;
  }
`;

export const Container = styled.div<{offset: OffsetInterface}>`
  border-radius: 10px;
  pointer-events: all;

  &.rightBottom {
    margin: 0 ${(props) => props.offset?.right || 0}px ${(props) => props.offset?.bottom || 0}px 0;
  }

  &.rightTop {
    margin: ${(props) => props.offset?.top || 0}px ${(props) => props.offset?.right || 0}px 0 0;
  }

  &.leftTop {
    margin: ${(props) => props.offset?.top || 0}px 0 0 ${(props) => props.offset?.left || 0}px;
  }

  &.topLeft {
    margin: ${(props) => props.offset?.top || 0}px 0 0 60px;
  }
`;
