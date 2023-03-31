import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  pointer-events: none;
`;

export const Wrapper = styled.div`
  padding: 20px 10px 50px 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const Boxes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  pointer-events: all;
  width: 420px;
`;

export const MintingMessageBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  gap: 20px;
  background: ${(props) => props.theme.bg};
  padding: 20px 10px;
  border-radius: 10px;
`;
