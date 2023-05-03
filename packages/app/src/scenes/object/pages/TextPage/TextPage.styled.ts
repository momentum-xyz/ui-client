import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 10px;
  width: 620px;
  padding-bottom: 40px;
  max-height: 700px;
  cursor: pointer;
  background: ${(props) => props.theme.bg};
  z-index: 200;
  pointer-events: all;
`;

export const TextTile = styled.div`
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  text-align: justify;
  white-space: pre-line;
  margin-top: 80px;

  width: 80%;
  height: 80%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;

  padding-top: 5px;
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
  flex-direction: column;
  // justify-content: center;
  // align-items: center;

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
