import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: var(--font-size-ts);
  width: 160px;
  padding-top: 15px; ;
`;

export const SeekBar = styled.input`
  position: absolute;
  align-items: center;
  transition: width 2s;
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
export const SeekBarContainer = styled.div<{width: string}>`
  position: relative;
  align-items: center;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  border-radius: 10px;
  height: 2.39px;
  width: ${(props) => props.width};
`;
export const BarThumbPosition = styled.div<{width: string}>`
  position: absolute;
  background: ${(props) => props.theme.accent};
  border-radius: 10px;
  height: 2px;
  width: ${(props) => props.width};
`;

export const SeekBarWrapper = styled.div``;
export const Duration = styled.div`
  color: var(--player-default-color);
`;
export const Elapsed = styled.div`
  color: var(--player-default-color);
`;
