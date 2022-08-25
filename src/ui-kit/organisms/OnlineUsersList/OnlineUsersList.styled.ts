import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

export const List = styled.div`
  height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar-track-piece:end {
    margin-bottom: 10px;
  }
`;
