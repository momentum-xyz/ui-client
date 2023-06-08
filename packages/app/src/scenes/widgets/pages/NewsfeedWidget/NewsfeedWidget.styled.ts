import styled from 'styled-components';

export const Container = styled.div``;

export const Wrapper = styled.div`
  position: relative;
  padding: 20px 0 0 0;

  height: 100%;

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
  height: calc(100vh - var(--height-offset) - 40px);
  overflow: scroll;
  display: flex;
  flex-direction: column;
  & > div:first-child > div {
    padding-top: 30px;
  }
`;
