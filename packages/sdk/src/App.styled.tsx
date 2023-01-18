import {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
  }
  
  input, button {
    background: transparent;
    border: none;
  }
  
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
