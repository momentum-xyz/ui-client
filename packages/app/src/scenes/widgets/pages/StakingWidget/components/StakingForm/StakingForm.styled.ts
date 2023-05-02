import {rgba} from 'polished';
import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';

export const Container = styled.div``;

export const TabContent = styled.div`
  height: 300px;
  width: 500px;
  display: flex;
  flex-direction: column;
`;

export const Filters = styled.div`
  padding: 12px 0 10px 0;
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 30px;
`;

export const NoWalletContainer = styled.div`
  display: flex;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.accentText};
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  padding: 10px 10px;
  margin: 20px 0 0;
  gap: 8px;
`;

export const AlertMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const BottomText = styled(Text)`
  text-decoration-line: underline;
  color: ${(props) => props.theme.accentText};
`;

export const Section = styled.div`
  margin-top: 20px;
`;

export const SectionHeader = styled.div`
  margin-bottom: 10px;
  opacity: 80%;
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
    font-size: var(--font-size-xxs);
  }
  &.view-only input:disabled {
    opacity 100%;
    background: transparent;
  }
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
  border-color: ${(props) => props.theme.accentText};
`;

export const ConsentContainer = styled.div`
  padding-left: 140px;
  margin-bottom: 41px;
`;
