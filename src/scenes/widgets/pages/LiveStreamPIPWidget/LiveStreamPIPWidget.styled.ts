import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
  width: 640px;
  height: 360px;
  cursor: pointer;

  z-index: 100;
  left: 240px;
  bottom: 60px;
`;

export const HeaderElement = styled.div`
  background: var(--black-80);
  border-radius: 4px;
  padding: 5px 10px;
  opacity: 0.5;
  position: absolute;
  top: 0;

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
`;
