import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  overflow: hidden;
  background: var(--black-80);
  border-radius: 10px;
  bottom: 50px;
  opacity: 0.8;
  right: 105px;
  width: 300px;
  max-height: 320px;
  cursor: pointer;

  :hover {
    opacity: 1;
  }

  z-index: 100;
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
