import styled from 'styled-components';

export const Container = styled.div``;

export const Wrapper = styled.div`
  position: relative;
  padding: 10px 0 0 0;

  &.collapsed {
    opacity: 0;
  }
`;

export const Tabs = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: -2px;
  right: 10px;
  left 0;
  z-index: 1;
`;

export const Content = styled.div``;

export const Details = styled.div`
  padding: 0 0 0 40px;
`;

export const TokenSelector = styled.div`
  padding: 12px 0 10px 0;
  display: grid;
  gap: 10px;
  grid-template-columns: 120px 1fr;
  align-items: center;
`;
