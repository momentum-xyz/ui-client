import {rgba} from 'polished';
import styled from 'styled-components';
// TODO: Fix colors
export const Wrapper = styled.div`
  background: #00437333;
  width: 380px;
  border-radius: 4px;
`;

export const Header = styled.div`
  display: flex;
  gap: 10px;
`;
export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;
export const UserInfoTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  line-height: 18px;
`;

export const Content = styled.div`
  padding-left: 18px;
  margin-top: 10px;
`;

export const PostTypeSelection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const PostTypeSelectionInfo = styled.span``;
export const PostTypeSelectionTypes = styled.div`
  display: flex;
  gap: 10px;
`;
export const PostTypeSelectionTypeButton = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100px;

  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.accentText};
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  cursor: pointer;

  & > span {
    text-align: center;
    line-height: 16px;
  }

  &:hover {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  }
`;
export const PostTypeSelectionControls = styled.div`
  display: flex;
  justify-content: flex-end;
`;
