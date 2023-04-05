import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding-top: 5px;
`;

export const Title = styled.div`
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
  padding: 0 0 2px 2px;
  font-size: var(--font-size-xs);
  font-weight: 400;
`;

export const VolumeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  width: 195px;
`;

export const VolumeBarContainer = styled.div`
  position: relative;
  align-items: center;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  border-radius: 10px;
  height: 2.39px;
  width: 100%;
`;

export const BarThumbPosition = styled.div<{width: string}>`
  position: absolute;
  background: ${(props) => props.theme.accentText};
  border-radius: 10px;
  height: 2px;
  width: ${(props) => props.width};
`;

export const VolumeBar = styled.input`
  position: absolute;
  align-items: center;
  transition: width 2s;
  height: 2.39px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  ::-webkit-slider-thumb {
    appearance: none;
    width: 8px;
    height: 8px;
    transition: all;
    duration: 150;
    background: white;
  }
`;
