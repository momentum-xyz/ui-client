import styled from 'styled-components';
import {rgba} from 'polished';

export const Progress = styled.div`
  --min: 0;
  --max: 100;
  --value: 0;

  margin: -5px 0 0 0;

  input[type='range'].styled-slider {
    -webkit-appearance: none;
    width: 100%;
  }

  /* PROGRESS SUPPORT */

  input[type='range'].styled-slider.slider-progress {
    --range: calc(var(--max) - var(--min));
    --ratio: calc((var(--value) - var(--min)) / var(--range));
    --sx: calc(0.5 * 2px + var(--ratio) * (100% - 2px));
  }

  input[type='range'].styled-slider:focus {
    outline: none;
  }

  /* WEBKIT */

  input[type='range'].styled-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 2px;
    height: 6px;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    border: none;
    box-shadow: none;
    margin-top: -2px;
  }

  input[type='range'].styled-slider::-webkit-slider-runnable-track {
    height: 2px;
    border: none;
    border-radius: 0;
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
    box-shadow: none;
  }

  input[type='range'].styled-slider::-webkit-slider-thumb:hover {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider:hover::-webkit-slider-runnable-track {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider::-webkit-slider-thumb:active {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider:active::-webkit-slider-runnable-track {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider.slider-progress::-webkit-slider-runnable-track {
    background: linear-gradient(${(props) => props.theme.text}, ${(props) => props.theme.text}) 0 /
        var(--sx) 100% no-repeat,
      ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider.slider-progress:hover::-webkit-slider-runnable-track {
    background: linear-gradient(${(props) => props.theme.text}, ${(props) => props.theme.text}) 0 /
        var(--sx) 100% no-repeat,
      ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider.slider-progress:active::-webkit-slider-runnable-track {
    background: linear-gradient(${(props) => props.theme.text}, ${(props) => props.theme.text}) 0 /
        var(--sx) 100% no-repeat,
      ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  /* MOZILLA */

  input[type='range'].styled-slider::-moz-range-thumb {
    width: 2px;
    height: 6px;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    border: none;
    box-shadow: none;
  }

  input[type='range'].styled-slider::-moz-range-track {
    height: 2px;
    border: none;
    border-radius: 0;
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
    box-shadow: none;
  }

  input[type='range'].styled-slider::-moz-range-thumb:hover {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider:hover::-moz-range-track {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider::-moz-range-thumb:active {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider:active::-moz-range-track {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider.slider-progress::-moz-range-track {
    background: linear-gradient(${(props) => props.theme.text}, ${(props) => props.theme.text}) 0 /
        var(--sx) 100% no-repeat,
      ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider.slider-progress:hover::-moz-range-track {
    background: linear-gradient(${(props) => props.theme.text}, ${(props) => props.theme.text}) 0 /
        var(--sx) 100% no-repeat,
      ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider.slider-progress:active::-moz-range-track {
    background: linear-gradient(${(props) => props.theme.text}, ${(props) => props.theme.text}) 0 /
        var(--sx) 100% no-repeat,
      ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  /* MS */

  input[type='range'].styled-slider::-ms-fill-upper {
    background: transparent;
    border-color: transparent;
  }

  input[type='range'].styled-slider::-ms-fill-lower {
    background: transparent;
    border-color: transparent;
  }

  input[type='range'].styled-slider::-ms-thumb {
    width: 2px;
    height: 6px;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    border: none;
    box-shadow: none;
    margin-top: 0;
    box-sizing: border-box;
  }

  input[type='range'].styled-slider::-ms-track {
    height: 2px;
    border-radius: 0;
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
    border: none;
    box-shadow: none;
    box-sizing: border-box;
  }

  input[type='range'].styled-slider::-ms-thumb:hover {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider:hover::-ms-track {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider::-ms-thumb:active {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider:active::-ms-track {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  }

  input[type='range'].styled-slider.slider-progress::-ms-fill-lower {
    margin: 0;
    height: 2px;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    border: none;
    border-right-width: 0;
  }

  input[type='range'].styled-slider.slider-progress:hover::-ms-fill-lower {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress:active::-ms-fill-lower {
    background: ${(props) => props.theme.text};
  }
`;
