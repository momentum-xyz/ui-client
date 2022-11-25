import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  pointer-events: none;
`;

export const Wrapper = styled.div`
  padding: 20px 20px 50px 20px;
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
`;
