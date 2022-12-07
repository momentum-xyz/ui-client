import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  margin-top: 20px;
  display: flex;
  position: relative;
  flex-direction: column;
  width: 240px;
  height: 439px;
  gap: 20px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
`;

export const Information = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid rgba(255, 242, 241, 0.2);
  cursor: pointer;
`;
export const UsersContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  height: 100%;
`;

export const Modal = styled.div`
  position: absolute;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: var(--dialog-z-index);
  pointer-events: all;

  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.3)};

  opacity: 1;

  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
`;

export const OuterContainer = styled.div`
  display: flex;
  gap: 10px;
  border-radius: 10px;
  pointer-events: all;
`;
