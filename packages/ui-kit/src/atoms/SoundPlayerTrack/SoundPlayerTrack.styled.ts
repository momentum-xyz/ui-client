import styled from 'styled-components';

export const Progress = styled.div<{value: number}>`
  --min: 0;
  --max: 100;

  margin: -5px 0 0 0;

  input[type='range'].styled-slider {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
  }

  /* PROGRESS SUPPORT */

  input[type='range'].styled-slider.slider-progress {
    --range: calc(var(--max) - var(--min));
    --ratio: calc((${(props) => props.value} - var(--min)) / var(--range));
    --sx: calc(0.5 * 8px + var(--ratio) * (100% - 8px));

    &:hover {
      cursor: pointer;
    }
  }

  input[type='range'].styled-slider:focus {
    outline: none;
  }

  /* WEBKIT */

  input[type='range'].styled-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: ${(props) => props.theme.accentText};
    border: none;
    box-shadow: none;
    margin-top: calc(4px * 0.5 - 8px * 0.5);
  }

  input[type='range'].styled-slider::-webkit-slider-runnable-track {
    height: 4px;
    border: none;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    box-shadow: none;
  }

  input[type='range'].styled-slider::-webkit-slider-thumb:hover {
    background: ${(props) => props.theme.accentText};
  }

  input[type='range'].styled-slider:hover::-webkit-slider-runnable-track {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider::-webkit-slider-thumb:active {
    background: ${(props) => props.theme.accentText};
  }

  input[type='range'].styled-slider:active::-webkit-slider-runnable-track {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress::-webkit-slider-runnable-track {
    background: linear-gradient(
          ${(props) => props.theme.accentText},
          ${(props) => props.theme.accentText}
        )
        0 / var(--sx) 100% no-repeat,
      ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress:hover::-webkit-slider-runnable-track {
    background: linear-gradient(
          ${(props) => props.theme.accentText},
          ${(props) => props.theme.accentText}
        )
        0 / var(--sx) 100% no-repeat,
      ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress:active::-webkit-slider-runnable-track {
    background: linear-gradient(
          ${(props) => props.theme.accentText},
          ${(props) => props.theme.accentText}
        )
        0 / var(--sx) 100% no-repeat,
      ${(props) => props.theme.text};
  }

  /* MOZILLA */

  input[type='range'].styled-slider::-moz-range-thumb {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: ${(props) => props.theme.accentText};
    border: none;
    box-shadow: none;
  }

  input[type='range'].styled-slider::-moz-range-track {
    height: 4px;
    border: none;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    box-shadow: none;
  }

  input[type='range'].styled-slider::-moz-range-thumb:hover {
    background: ${(props) => props.theme.accentText};
  }

  input[type='range'].styled-slider:hover::-moz-range-track {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider::-moz-range-thumb:active {
    background: ${(props) => props.theme.accentText};
  }

  input[type='range'].styled-slider:active::-moz-range-track {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress::-moz-range-track {
    background: linear-gradient(
          ${(props) => props.theme.accentText},
          ${(props) => props.theme.accentText}
        )
        0 / var(--sx) 100% no-repeat,
      ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress:hover::-moz-range-track {
    background: linear-gradient(
          ${(props) => props.theme.accentText},
          ${(props) => props.theme.accentText}
        )
        0 / var(--sx) 100% no-repeat,
      ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress:active::-moz-range-track {
    background: linear-gradient(
          ${(props) => props.theme.accentText},
          ${(props) => props.theme.accentText}
        )
        0 / var(--sx) 100% no-repeat,
      ${(props) => props.theme.text};
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
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: ${(props) => props.theme.accentText};
    border: none;
    box-shadow: none;
    margin-top: 0;
    box-sizing: border-box;
  }

  input[type='range'].styled-slider::-ms-track {
    height: 4px;
    border-radius: 0;
    background: ${(props) => props.theme.text};
    border: none;
    box-shadow: none;
    box-sizing: border-box;
  }

  input[type='range'].styled-slider::-ms-thumb:hover {
    background: ${(props) => props.theme.accentText};
  }

  input[type='range'].styled-slider:hover::-ms-track {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider::-ms-thumb:active {
    background: ${(props) => props.theme.accentText};
  }

  input[type='range'].styled-slider:active::-ms-track {
    background: ${(props) => props.theme.text};
  }

  input[type='range'].styled-slider.slider-progress::-ms-fill-lower {
    height: 4px;
    border-radius: 0px 0 0 0px;
    margin: 0;
    background: ${(props) => props.theme.accentText};
    border: none;
    border-right-width: 0;
  }

  input[type='range'].styled-slider.slider-progress:hover::-ms-fill-lower {
    background: ${(props) => props.theme.accentText};
  }

  input[type='range'].styled-slider.slider-progress:active::-ms-fill-lower {
    background: ${(props) => props.theme.accentText};
  }
`;
