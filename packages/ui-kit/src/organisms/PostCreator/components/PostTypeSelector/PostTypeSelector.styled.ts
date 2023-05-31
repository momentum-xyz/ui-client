import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
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
  height: 100px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
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
