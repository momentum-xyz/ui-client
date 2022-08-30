import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  .input-header {
    margin-left: 10px;
    margin-bottom: 5px;
  }
`;

export const InputContainer = styled.div`
  --input-height: 37px;

  display: flex;
  align-items: center;
  padding-right: 10px;
  width: 100%;

  height: var(--input-height);
  &.withBackground {
    background: ${rgba(0, 1, 1, 0.2)};
    border-radius: 6px;
  }
  &.noBorder {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  &.focused,
  :hover {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.05)};
    .input-icon {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
      stroke: currentColor;
    }
  }
  .input-icon {
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.8)};
  }
`;

export const Input = styled.input`
  background: transparent;
  color: ${(props) => props.theme.text};
  outline: none;
  height: 100%;
  width: 100%;

  margin: 10px 0;
  padding: 0 10px;

  ::placeholder {
    color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
    font-size: var(--font-size-s);
    margin: auto;
  }
`;
