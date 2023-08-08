import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const ControlsRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
`;

export const ControlsRowTitle = styled.span`
  flex: 0 0 86px;
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
