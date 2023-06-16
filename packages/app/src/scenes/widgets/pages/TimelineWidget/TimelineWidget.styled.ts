import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 12px;
`;

export const PanelContainer = styled.div`
  display: flex;
`;

export const InfinityList = styled.div`
  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

export const Wrapper = styled.div`
  padding: 0;
  position: relative;
  height: 100%;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
`;
