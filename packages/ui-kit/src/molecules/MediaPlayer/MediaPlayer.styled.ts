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

export const Progress = styled.div`
  margin: -5px 0 0 0;

  input[type='range'] {
    width: 100%;
    -webkit-appearance: none;
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

    &:focus {
      outline: none;
    }
  }

  /* TRACK */

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    -webkit-appearance: none;
    border-radius: 0;
    border: none;
  }

  /* THUMB */

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -2px;
    border: none;
    height: 6px;
    width: 2px;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    cursor: pointer;
  }
`;
