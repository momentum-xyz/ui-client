import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 410px;

  position: relative;
`;

export const Steps = styled.div`
  position: absolute;
  right: 20px;
  top: 42px;
  z-index: 1;
`;

export const WordContainer = styled.div`
  padding: 5px 0 0 0;
  position: relative;
`;

export const WorldName = styled.div`
  position: absolute;
  bottom: 15px;
  left: 20px;
  right: 20px;
  font-weight: 700;
  font-size: var(--font-size-l);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const ScrollableContainer = styled.div`
  margin: 0 10px;
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;
