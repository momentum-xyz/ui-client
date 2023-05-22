import {createGlobalStyle} from 'styled-components';
import {rgba} from 'polished';

export const GlobalStyles = createGlobalStyle`
  body {
    color: ${(props) => props.theme.text};
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 0;
    border: 2px solid transparent;
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
   }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 3px solid transparent;
    background-clip: content-box;
    background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
    max-height: 40px;
  }

  ::-webkit-scrollbar-track {
    display: none;
  }

  ::-webkit-scrollbar-track-piece:start {
    margin-top: 4px;
  }
 
  ::-webkit-scrollbar-track-piece:end {
    margin-bottom: 4px;
  }
  
  a {
    color: ${(props) => props.theme.text};
    text-decoration: underline;
    cursor: pointer;
  
    &:hover {
      text-decoration: none;
    }
  }
`;
