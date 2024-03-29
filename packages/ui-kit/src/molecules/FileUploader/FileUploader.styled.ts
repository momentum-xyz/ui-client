import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
  cursor: default;
  gap: 16px;

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

  &.withFrame {
    position: relative;
    padding-top: 0px;
    margin-top: 0px;

    padding: 45px;
    border: 1px dashed ${(props) => props.theme.text};
    border-radius: 8px;
    margin-bottom: 20px;
  }
`;

export const DropZone = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
`;

export const Text = styled.div`
  padding: 20px 0 0 0;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: white;
`;
