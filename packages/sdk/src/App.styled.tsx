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

  // TEMPORARY, should become part of ui-kit
  :root {
    --online: #01ffb3;
    --dnd: #f25d05;
  
    --white: #ffffff;
    --black: #000000;
    --white-30: #fff2f14d;
  }
`;
