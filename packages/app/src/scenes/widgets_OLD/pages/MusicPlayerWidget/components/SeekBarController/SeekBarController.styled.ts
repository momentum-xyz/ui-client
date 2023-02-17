import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: var(--font-size-xxs);
  width: 170px;
  padding-top: 15px;
`;

export const SeekBar = styled.input`
  position: absolute;
  align-items: center;
  transition: width 1s;
  height: 2.39px;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.0)};
  ::-webkit-slider-thumb {
    appearance: none;
    width: 8px;
    height: 8px;
    transition: all;
    duration: 150;
    background: white;
  }
`;

export const SeekBarContainer = styled.div`
  position: relative;
  align-items: center;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  border-radius: 10px;
  height: 2.39px;
  width: 100%;
`;

export const BarThumbPosition = styled.div<{width: string}>`
  position: absolute;
  background: ${(props) => props.theme.accent};
  border-radius: 10px;
  height: 2px;
  width: ${(props) => props.width};
`;

export const Duration = styled.div`
  color: var(--player-default-color);
`;

export const Elapsed = styled.div`
  color: var(--player-default-color);
`;
