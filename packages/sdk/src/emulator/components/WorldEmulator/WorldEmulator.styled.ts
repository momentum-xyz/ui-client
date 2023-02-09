import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Button = styled.button`
  border: 1px solid black;
`;

export const ControlPanel = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #888;
  padding: 5px;
  border-radius: 0 0 5px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
