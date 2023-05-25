import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  margin: 1px;
  padding: 0 10px;
  display: grid;
  height: 58px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  grid-template-columns: 42px 1fr 30px;
  font-size: var(--font-size-l);
  font-weight: 600;
  letter-spacing: 0.2em;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  box-shadow: -1px -1px 2px rgba(158, 238, 255, 0.1);
  gap: 10px;

  &.isSpeaking {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.9)};
  }
`;

export const Hexagon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleContainer = styled.div`
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  align-items: start;
  overflow: hidden;
`;

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  &.isMuted {
    button {
      border: 1px solid ${(props) => props.theme.accentText};
    }
  }

  &.isSpeaking {
    button {
      background: ${(props) => props.theme.accentText};
    }

    svg {
      color: ${(props) => props.theme.accentBg};
    }
  }
`;
