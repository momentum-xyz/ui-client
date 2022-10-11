import {createGlobalStyle} from 'styled-components';
import {rgba} from 'polished';

export const GlobalStyles = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 5px;
    height: 0;
   }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 5px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.6)};
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
    
    &:hover {
    color: ${(props) => props.theme.accent};
    }
  }
  
  .react-datepicker {
    font-family: inherit !important;
    font-size: 11px !important;
    background-color: ${(props) => props.theme.bg} !important;
    color: ${(props) => props.theme.text} !important;
    border: 1px solid;
    border-color: ${(props) => props.theme.accent} !important;
    border-radius: 6px;
    padding: 5px;
  }
  .react-datepicker__header {
    background-color: ${(props) => props.theme.bg} !important;
    border-bottom: 1px solid !important;
    border-bottom-color: ${(props) => props.theme.accent} !important;
    border-top-left-radius: 6px !important;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    margin-top: 0;
    color: ${(props) => props.theme.accent} !important;
    font-weight: bold;
    font-size: 0.944rem;
  }
  .react-datepicker__day-name {
    color: ${(props) => props.theme.accent} !important;
  }
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: ${(props) => props.theme.text} !important;
    display: inline-block;
    width: 1.7rem;
    line-height: 1.7rem;
    text-align: center;
    margin: 0.166rem;
  }
  .react-datepicker__navigation-icon::before {
    border-color: ${(props) => props.theme.accent} !important;
  }
  .react-datepicker__day--today {
    font-weight: 800;
    color: var(--white) !important;
  }
  .react-datepicker__day:hover {
    background-color: ${(props) => props.theme.accent} !important;
  }
  .react-datepicker__input-time-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .react-datepicker-time__caption {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 11px;
    color: ${(props) => props.theme.accent} !important;
    margin: 0;
  }
  .react-datepicker-time__input-container .react-datepicker-time__input {
    margin-left: 3px;
    border-radius: 10px;
    height: 26px;
    margin-right: 10px;
    padding-right: 0;
  }
  .react-datepicker-time__input input {
    padding-left: 5px;
    background: ${(props) => props.theme.bg} !important;
  }

  .react-datepicker-popper[data-placement^='bottom'] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^='bottom'] .react-datepicker__triangle::after {
    border-bottom-color: ${(props) => props.theme.accent} !important;
  }
  .react-datepicker-time__input {
    color: var(--white) !important;
    font-weight: 700;
    font-size: 16px;
  }
  .react-datepicker__navigation {
    margin-top: 10px;
    z-index: calc(var(--dialog-z-index) + 1) !important;
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.accent} !important;
  }
  .react-datepicker__time-container {
    border-left-color: ${(props) => props.theme.accent} !important;
  }
  .react-datepicker__time-container .react-datepicker__time {
    background: ${(props) => props.theme.bg} !important;
  }
`;
