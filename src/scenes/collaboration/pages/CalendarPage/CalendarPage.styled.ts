import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
`;

export const InnerContainer = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
`;
