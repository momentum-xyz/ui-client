import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  position: absolute;

  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 10px;
  width: 1277px;
  height: 737px;
  cursor: pointer;
  background: ${(props) => props.theme.bg};
  &.notFlyAround {
    border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.8)};
  }
  z-index: 200;
  pointer-events: all;
`;

export const ChangeTextForm = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.bg};
  border: 1px solid ${(props) => props.theme.accent};
  border-radius: 10px;
  padding: 10px;
  z-index: 300;
  gap: 10px;
  pointer-events: all;

  width: 300px;
`;

export const HeaderElement = styled.div`
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
  &.button {
    top: 15px;
    right: 80px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 70px;

  height: 100%;
  width: 100%;
`;

export const Title = styled.div`
  padding: 30px 0 0 30px;
  min-width: 0;
`;

export const Button = styled.div`
  padding: 30px 30px 0 0;
  min-width: 0;
`;

export const Modal = styled.div`
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  justify-content: center;
  align-items: center;
  z-index: calc(var(--dialog-z-index) + 1);
`;
