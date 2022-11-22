import {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
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
