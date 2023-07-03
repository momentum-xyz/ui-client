import styled from 'styled-components';
import {rgba} from 'polished';

export const Separator = styled.div`
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  margin: 10px;
`;

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ControlsContainer = styled.div``;
export const ControlsInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const SkyboxTypeContainer = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
  border-radius: 4px;
  height: 40px;
  & > button {
    flex: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -1px;
    &:not(.active) {
      box-shadow: none;
      border-color: transparent;
      background: transparent;
    }
  }
`;
export const SkyboxSearchContainer = styled.div``;

export const SkyboxListContainer = styled.div`
  padding: 0 10px;
`;

export const SkyboxListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2em;
  line-height: 24px;
  text-transform: uppercase;
  margin-bottom: 10px;
`;
