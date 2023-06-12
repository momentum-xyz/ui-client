import {rgba} from 'polished';
import styled from 'styled-components';

export const Wrapper = styled.div`
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  width: 360px;
  border-radius: 4px;
`;

export const Content = styled.div`
  padding-left: 18px;
  margin-top: 10px;
`;

export const TextEntryContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
export const TextEntryText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em;
`;
export const WorldName = styled.a`
  color: ${(props) => props.theme.accentText};
  cursor: pointer;
`;

export const MediaEntryContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;
export const MediaEntryVideoContainer = styled.div`
  border-radius: 4px;
  overflow: hidden;
`;
export const MediaEntryComment = styled.p`
  display: flex;
  gap: 10px;
  align-items: center;
`;
export const MediaEntryControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
`;
