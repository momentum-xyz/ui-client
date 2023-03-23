import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ControlPanel = styled.div`
  position: absolute;
  padding: 10px;
  transform: translateX(-50%);
  background-color: #888;
  border-radius: 0 0 5px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 50%;
  gap: 10px;
`;

export const Actions = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: #888;
`;
