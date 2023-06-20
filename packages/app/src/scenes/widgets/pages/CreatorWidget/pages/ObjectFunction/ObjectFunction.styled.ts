import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px 10px 10px 10px;
  width: 100%;
`;

export const HeadingWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PanelBody = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ActionBar = styled.div`
  padding: 20px 0 0 0;
  display: flex;
  justify-content: center;
  align-items: space-between;
  gap: 40px;
  & > button {
    flex: 1;
    justify-content: center;
  }
`;

export const AssignFunctionContainer = styled.div``;
export const Title = styled.h1`
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: 0.2em;
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
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
export const FunctionType = styled.button`
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  height: 110px;
  width: 175px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};
`;
export const FunctionTypeTitle = styled.p`
  line-height: 22px;
  letter-spacing: 0.02em;
  margin-top: 8px;
`;
