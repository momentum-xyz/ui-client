import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  pointer-events: none;
`;

export const PanelWrapper = styled.div`
  pointer-events: all;
  height: 100%;
`;

export const Rejoin = styled.div`
  position: absolute;
  right: 222px;
  top: 12px;
`;
