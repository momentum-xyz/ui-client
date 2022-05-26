import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div<{height: string}>`
  z-index: 110;
  position: relative;
  overflow: auto;
  max-height: ${(props) => props.height};
  background: ${(props) => props.theme.bg};
  &.hasBorder {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }
`;
export const TextItem = styled.div`
  padding-left: 5px;
`;
export const IconItem = styled.span`
  justify-items: center;
  margin: auto 0;
  padding-right: 5px;
  cursor: pointer;
`;
export const Div = styled.div`
  display: flex;
  background: ${(props) => props.theme.bg};
  :hover {
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
    &.hasBorder {
      border-radius: 0;
    }
  }
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  &.hasBorder {
    border-radius: 0;
  }
  justify-items: center;
  justify-content: space-between;
  padding: 5px;
`;

export const TextRow = styled.div`
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ListItem = styled.div`
  padding: 5px;
  :hover {
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  }
  cursor: pointer;
  padding-left: 10px;
`;
export const TokenContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: flex-start;
  padding-left: 5px;
`;
export const StyledSearchContainer = styled.div`
  padding-top: 20px;
  width: 100%;
  height: 100%;
  .Heading-custom {
    margin-left: 10px;
    margin-bottom: 5px;
  }
  z-index: calc(var(--dialog-z-index) + 2);
`;
export const StyledSearchDiv = styled.div`
  position: relative;
  border: 1px solid transparent;
  width: 100%
  height: 100%;
  :hover{
  border: 1px solid ${(props) => props.theme.accent};
  }
  
  &.focus {
    border: 1px solid ${(props) => props.theme.accent};
    
    &.input{
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    
    }
  }
  
  
  border-radius: 6px;
  z-index: calc(var(--dialog-z-index) + 2);
`;
