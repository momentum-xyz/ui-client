import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  z-index: var(--dialog-z-index);
  overflow: auto;
  padding-right: 10px;
  padding-left: 10px;
  margin: 10px;
  width: 522px;
  height: 60vh;
  .SearchInput-custom {
    background: ${rgba(0, 1, 1, 0.2)};
  }
  position: relative;
`;

export const LoaderContainer = styled.div`
  z-index: var(--dialog-z-index);
  display: flex;
  width: 522px;
  height: 60vh;
  align-items: center;
  justify-content: center;
`;

export const Item = styled.div`
  padding-top: 20px;
  position: relative;
  z-index: calc(var(--dialog-z-index) + 1);
`;

export const Dialog = styled.div`
  padding: 40px;
`;

export const Div = styled.div`
  display: grid;
`;

export const TextItem = styled.div``;

export const StyledSearchDiv = styled.div`
position: relative;
  width: 100%
  height: 100%;
  
  &.focus {
    border: 1px solid ${(props) => props.theme.accent};
    
    &.input{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    
    }
  }
  
  
  border-radius: 6px;
  z-index: calc(var(--dialog-z-index) + 1)
`;
export const StyledSearchContainer = styled.div`
  padding-top: 20px;
  width: 100%;
  height: 100%;
  .Heading-custom {
    margin-left: 10px;
    margin-bottom: 5px;
  }
  z-index: calc(var(--dialog-z-index) + 1);
`;

export const BalanceItem = styled.div`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  padding-top: 200px;
  padding-right: 20px;
  width: 100%;
  position: absolute;
  z-index: var(--dialog-z-index);
`;
