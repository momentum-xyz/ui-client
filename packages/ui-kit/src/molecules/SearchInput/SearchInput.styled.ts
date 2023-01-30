import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  --input-height: initial;
  --input-height-primary: 37px;
  --input-height-secondary: 37px;

  --input-padding: initial;
  --input-padding-primary: 0 30px 0 10px;
  --input-padding-secondary: 0 30px 0 10px;

  padding: var(--input-padding);
  height: var(--input-height);
  width: 100%;
  outline: none;
  background: transparent;
  color: ${(props) => props.theme.text};

  ::placeholder {
    margin: auto;
    color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
  }

  &.withBackground {
    background: ${rgba(0, 1, 1, 0.2)};
  }

  &.primary {
    --input-height: var(--input-height-primary);
    --input-padding: var(--input-padding-primary);

    ::placeholder {
      font-size: var(--font-size-s);
    }
  }

  &.secondary {
    --input-height: var(--input-height-secondary);
    --input-padding: var(--input-padding-secondary);

    ::placeholder {
      font-size: var(--font-size-s);
    }
  }

  &:hover,
  &:focus {
    background: ${(props) => props.theme.text && rgba(props.theme.text, 0.05)};
  }
`;

export const Icon = styled.div`
  --icon-top: initial;
  --icon-top-primary: 10px;
  --icon-top-secondary: 10px;

  --icon-right: initial;
  --icon-right-primary: 8px;
  --icon-right-secondary: 8px;

  position: absolute;
  right: var(--icon-right);
  top: var(--icon-top);
  opacity: 0.5;

  &.primary {
    --icon-top: var(--icon-top-primary);
    --icon-right: var(--icon-right-primary);
  }

  &.secondary {
    --icon-top: var(--icon-top-secondary);
    --icon-right: var(--icon-right-secondary);
  }
`;
