import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div<{height: number}>`
  --border-radius: 4px;

  display: flex;
  width: 100%;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);

  &:hover {
    cursor: pointer;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
`;

export const ErroredImage = styled.div`
  pointer-events: none;
`;
