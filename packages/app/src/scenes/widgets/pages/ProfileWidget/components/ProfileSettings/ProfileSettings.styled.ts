import styled from 'styled-components';

export const Container = styled.div``;

export const Title = styled.div`
  padding: 0 0 10px 0;
  font-weight: 600;
  font-size: var(--font-size-l);
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const DeviceItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const Actions = styled.div`
  padding: 10px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;
