import styled from 'styled-components';

export const Container = styled.div``;

export const DeviceItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin: 17px 0;
`;

export const Actions = styled.div`
  padding: 10px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;
