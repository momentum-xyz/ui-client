import {createGlobalStyle} from 'styled-components';
import {rgba} from 'polished';

export const GlobalStyles = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 5px;
    height: 0;
   }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 5px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
    background-clip: content-box;
    max-height: 40px;
  }

  ::-webkit-scrollbar-track {
    display: none;
  }

  ::-webkit-scrollbar-track-piece:start {
    margin-top: 5px;
  }
 
  ::-webkit-scrollbar-track-piece:end {
    margin-bottom: 2px;
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
