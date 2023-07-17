import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const WarningContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const WarningContainerInner = styled.div`
  width: 260px;

  p {
    text-align: center;
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ActionBar = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  gap: 40px;

  & > button {
    flex: 1;
    justify-content: center;
    max-width: 156px;
  }
`;

export const AssignFunctionContainer = styled.div`
  padding: 10px;
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

export const Text = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: 0.02em;
`;

export const FunctionTypesContainer = styled.div`
  margin: 20px 0 0 0;
  padding: 20px 0 0 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  gap: 10px;
`;

export const FunctionType = styled.button`
  display: flex;
  height: 110px;
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  border-radius: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
`;

export const FunctionTypeTitle = styled.p`
  line-height: 22px;
  letter-spacing: 0.02em;
  margin-top: 8px;
`;

export const AssignAttribute = styled.p`
  margin: 20px 0 0 0;
  padding: 20px 0 0 0;
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;
