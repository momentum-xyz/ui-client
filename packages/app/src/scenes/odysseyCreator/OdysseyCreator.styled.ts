import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;
  gap: 10px;

  pointer-events: all;

  top: 10px;
  right: 10px;
  z-index: var(--dialog-z-index);
`;