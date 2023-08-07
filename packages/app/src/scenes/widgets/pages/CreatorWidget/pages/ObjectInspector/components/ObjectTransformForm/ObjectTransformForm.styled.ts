import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const ControlsRowTitle = styled.span`
  flex: 0 0 86px;
`;
export const ControlsRowInputsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;
export const ControlsRowInputContainer = styled.div`
  display: flex;
  align-items: center;
  & input,
  & div {
    width: 100px;
  }
`;
export const ControlsRowInputTitle = styled.h1`
  margin-right: 8px;
`;
