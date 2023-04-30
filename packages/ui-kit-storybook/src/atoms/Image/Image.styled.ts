import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div<{height: number}>`
  --border-radius: 4px;

  display: flex;
  width: 100%;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);

  &:hover {
    cursor: pointer;
  }
  &.bordered {
    border: 0.4px solid ${(props) => props.theme.text};
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
`;

export const ErroredImage = styled.div<{errorIconOffset: number}>`
  padding: 0 0 ${(props) => props.errorIconOffset}px 0;
  pointer-events: none;
`;
