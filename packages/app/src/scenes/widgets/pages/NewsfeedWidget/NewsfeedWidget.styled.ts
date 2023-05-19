import styled from 'styled-components';

export const Container = styled.div``;

export const Wrapper = styled.div`
  position: relative;
  padding: 20px 0 0 0;

  &.collapsed {
    opacity: 0;
  }
`;

export const Tabs = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: 12px;
  right: 10px;
  left 0;
  z-index: 1;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
