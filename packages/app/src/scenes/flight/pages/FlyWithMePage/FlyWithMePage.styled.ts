import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: start;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`;

export const Inner = styled.div`
  padding: 10px 0 0 0;
  border-radius: 10px;
  pointer-events: all;
`;
