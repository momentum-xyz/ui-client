import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  position: relative;

  video {
    border-radius: 4px;
    object-fit: cover;
  }
`;

export const PlayPause = styled.div`
  position: absolute;
  left: calc(50% - 20px);
  bottom: 26px;
`;

export const ProgressContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 50px auto 50px;
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.8)};
  font-size: var(--font-size-xxs);
  align-items: center;
  gap: 4px;
`;

export const Played = styled.div`
  text-align: right;
`;

export const Duration = styled.div`
  text-align: left;
`;
