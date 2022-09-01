import styled from 'styled-components';

export const Container = styled.div``;

export const InnerContainer = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  padding: 5px 6px;
  border-radius: 6px;
  background: var(--toolbar-bg);

  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  mixblendmode: difference;
`;
