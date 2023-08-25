import styled from 'styled-components';
import {rgba} from 'polished';

export const ImageType = styled.button`
  padding: 0 10px;
  display: flex;
  height: 110px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  gap: 8px;

  &.active {
    color: ${(props) => props.theme.accentText};

    svg {
      color: ${(props) => props.theme.accentText};
    }
  }

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.6;
  }
`;
