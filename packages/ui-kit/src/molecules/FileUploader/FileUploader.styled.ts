import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: default;

  button {
    justify-content: center;
    z-index: 2;
  }

  &.iconButton {
    button,
    button:hover,
    button:active {
      border: none;
      background-color: transparent;
      box-shadow: none;
    }
  }
`;

export const DropZone = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
`;

export const Text = styled.p`
  color: white;
`;
