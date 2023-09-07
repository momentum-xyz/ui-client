import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const Steps = styled.div`
  position: absolute;
  top: -5px;
  right: 10px;
`;

export const StepContent = styled.div`
  padding: 18px 0 0 0;

  > div {
    padding-top: 20px;
  }
`;

export const Limit = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  align-items: center;
  justify-content: center;
`;
