import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin: 0 20px;
  padding-top: 20px;
  pointer-events: none;

  &.hasJoined {
    margin: 0 calc(var(--meeting-size) + 12px) 0 20px;
  }
`;

export const PanelWrapper = styled.div`
  pointer-events: all;
  height: 100%;
`;

export const Rejoin = styled.div`
  position: absolute;
  right: 245px;
`;
