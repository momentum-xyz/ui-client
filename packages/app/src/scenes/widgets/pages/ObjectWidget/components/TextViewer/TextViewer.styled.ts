import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 270px;

  padding: 10px;
  pointer-events: all;
`;

export const ScrollableContainer = styled.div`
  padding: 10px 0 0 0;
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;

export const Title = styled.div`
  padding: 0 0 10px 0;
  font-size: vat(--font-size-l);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
`;

export const Text = styled.div`
  line-height: 22px;
  letter-spacing: 0.02em;
`;
