import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div<{height: number}>`
  --border-radius: 4px;

  display: flex;
  width: 100%;
  height: ${(props) => props.height}px;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);

  &:hover {
    cursor: pointer;
  }
  &.bordered {
    border: 1px solid ${(props) => props.theme.text};
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);

  &.disabled {
    opacity: 0.2;
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};

  &.disabled {
    background-color: initial;
  }
`;

export const Error = styled.div<{errorIconOffset: number}>`
  padding: 0 0 ${(props) => props.errorIconOffset}px 0;
  pointer-events: none;

  &.accent {
    svg {
      color: ${(props) => props.theme.accentText};
    }
  }
`;
