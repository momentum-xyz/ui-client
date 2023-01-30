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
  --input-height-secondary: 52px;

  --input-padding: initial;
  --input-padding-primary: 0 30px 0 10px;
  --input-padding-secondary: 0 42px 0 16px;

  --input-background: initial;
  --input-background-primary: transparent;
  --input-background-secondary: rgba(255, 255, 255, 0.1);

  --input-border-radius: initial;
  --input-border-radius-primary: 0;
  --input-border-radius-secondary: 10px;

  --input-box-shadow: initial;
  --input-box-shadow-primary: initial;
  --input-box-shadow-secondary: 0px 4px 4px rgba(0, 0, 0, 0.25);

  --input-font-size: initial;
  --input-font-size-primary: var(--font-size-s);
  --input-font-size-secondary: var(--font-size-m);

  width: 100%;
  padding: var(--input-padding);
  height: var(--input-height);
  background: var(--input-background);
  border-radius: var(--input-border-radius);
  box-shadow: var(--input-box-shadow);
  font-size: var(--input-font-size);
  color: ${(props) => props.theme.text};
  outline: none;

  ::placeholder {
    color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
  }

  &.withBackground {
    background: ${rgba(0, 1, 1, 0.2)};
  }

  &.primary {
    --input-height: var(--input-height-primary);
    --input-padding: var(--input-padding-primary);
    --input-background: var(--input-background-primary);
    --input-border-radius: var(--input-border-radius-primary);
    --input-box-shadow: var(--input-box-shadow-primary);
    --input-font-size: var(--input-font-size-primary);

    ::placeholder {
      font-size: var(--input-font-size-primary);
    }
  }

  &.secondary {
    --input-height: var(--input-height-secondary);
    --input-padding: var(--input-padding-secondary);
    --input-background: var(--input-background-secondary);
    --input-border-radius: var(--input-border-radius-secondary);
    --input-box-shadow: var(--input-box-shadow-secondary);
    --input-font-size: var(--input-font-size-secondary);

    ::placeholder {
      font-size: var(--input-font-size-secondary);
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
  --icon-top-secondary: 16px;

  --icon-right: initial;
  --icon-right-primary: 8px;
  --icon-right-secondary: 14px;

  position: absolute;
  right: var(--icon-right);
  top: var(--icon-top);
  opacity: 0.9;

  &.primary {
    --icon-top: var(--icon-top-primary);
    --icon-right: var(--icon-right-primary);
  }

  &.secondary {
    --icon-top: var(--icon-top-secondary);
    --icon-right: var(--icon-right-secondary);
  }
`;
