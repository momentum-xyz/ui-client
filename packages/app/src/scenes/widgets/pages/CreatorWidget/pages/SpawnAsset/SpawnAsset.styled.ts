import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

export const Body = styled.div`
  padding: 0 10px 10px 10px;
  display: flex;
  flex-grow: 1;
`;

export const AssetsGroupList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Separator = styled.div`
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  margin: 10px;
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
