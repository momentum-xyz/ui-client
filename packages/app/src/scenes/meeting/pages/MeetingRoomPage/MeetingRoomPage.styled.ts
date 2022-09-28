import styled from 'styled-components';

export const Container = styled.div`
  margin: 0;
  height: 100%;
`;

export const Inner = styled.div`
  padding: 0 10px 0 0;
  display: flex;
  align-items: end;
  flex-direction: column;
  height: calc(100vh - 60px);
  pointer-events: none;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  align-items: center;
  pointer-events: auto;
`;

export const MuteButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  align-items: center;
  padding: 9px 0 5px;
`;
