import styled from 'styled-components';

import {Heading} from 'ui-kit';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StepContainerWrapper = styled.div`
  display: flex;
  gap: 0;
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 32px;
`;

export const Step = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid ${(props) => props.theme.accent};
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &.completed {
    background-color: ${(props) => props.theme.accent};
  }
`;

export const SelectedFill = styled.div`
  background: ${(props) => props.theme.accent};
  border-radius: 100%;
  width: 10px;
  height: 10px;
`;

export const LikingLine = styled.div`
  background: ${(props) => props.theme.text};
  height: 2px;
  width: 80px;
  transform: translateY(16px);

  &.completed {
    background: ${(props) => props.theme.accent};
  }
`;

export const Label = styled(Heading)`
  max-width: 112px;

  h3 {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
