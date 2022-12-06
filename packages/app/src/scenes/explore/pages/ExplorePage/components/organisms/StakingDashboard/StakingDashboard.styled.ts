import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div``;

export const TabContent = styled.div`
  height: 300px;
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1em;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  &.end {
    justify-content: flex-end;
  }
`;

export const Section = styled.div`
  margin-bottom: 20px;
`;

export const SectionHeader = styled.div`
  margin-bottom: 10px;
  opacity: 80%;
`;

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

export const BalanceEntityContainer = styled.div`
  padding: 6px;
  background: ${rgba(0, 1, 1, 0.2)};
  border-radius: 5px;
  min-width: calc(20% - 10px);
`;

export const Separator = styled.hr`
  border-width: 0.25px;
  margin-top: -10px;
  margin-bottom: 20px;
  opacity: 20%;
  border-color: ${(props) => props.theme.accent};
`;

export const LabeledLineContainer = styled.div`
  display: flex;
  align-items: center;
  height: 37px;
  margin-bottom: 10px;
`;

export const LabeledLineLabelContainer = styled.div`
  min-width: 120px;
  margin-right: 20px;
`;

export const LabeledLineInputContainer = styled.div`
  margin-top: -10px;
  flex: 1;
  & input {
    font-size: var(--font-size-xxxs);
  }
  &.view-only input:disabled {
    opacity 100%;
    background: transparent;
  }
`;

export const ActiveStakesLineContainer = styled.div``;
