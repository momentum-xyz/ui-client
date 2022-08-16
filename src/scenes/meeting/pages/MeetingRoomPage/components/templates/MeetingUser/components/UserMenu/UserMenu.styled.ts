import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  z-index: var(--dialog-z-index);
  width: 100vw;
  height: 95px;
  display: flex;
  align-items: center;
  right: 70px;
  top: 0;
`;

export const Inner = styled.div``;

export const Content = styled.div`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  width: 167px;
  border: 2px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

export const Triangle = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;

  border-left: 14px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
`;

export const Option = styled.button`
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  width: 167px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  :hover {
    background: rgba(255, 255, 255, 10%);
  }
`;

export const IconContainer = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
`;
