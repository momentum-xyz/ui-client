import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const ControlsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ControlsRowTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const ControlsRowInputsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
`;

export const ControlsRowInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;

  & input,
  & div {
    width: 100px;
  }
`;

export const ControlsRowInputTitle = styled.h1``;
