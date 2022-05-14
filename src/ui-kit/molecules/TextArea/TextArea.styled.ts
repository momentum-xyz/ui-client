import styled from 'styled-components';
import {rgba} from 'polished';

export const TextAreaContainer = styled.div`
  --input-padding: 5px 10px;
  --input-radius: 6px;

  background: ${rgba(0, 1, 1, 0.2)};
  border-radius: var(--input-radius);

  color: ${(props) => props.theme.text};

  position: relative;

  textarea {
    display: block;
    border-radius: var(--input-radius);
    width: 100%;
    font-size: var(--font-size-s);
    background: transparent;
    padding: var(--input-padding);
    border: 1px solid transparent;
    &:hover,
    &:active {
      color: var(--white);
      background: var(--hover-background);
      opacity: 0.7;
      border: 1px solid ${(props) => props.theme.accent};
    }
    &:focus {
      outline-style: none;
      box-shadow: none;
      border: 1px solid ${(props) => props.theme.accent};
      opacity: 1;
    }
    &:disabled {
      background: var(--hover-background);
      opacity: 0.7;
      &:hover {
        border: 1px solid transparent;
      }
    }
    &::placeholder {
      font-size: var(--font-size-s);
      margin: auto;
    }
    &.error {
      border: 1px solid ${(props) => props.theme.accentDanger};
    }
  }
  &.resizable {
    textarea {
      resize: none;
    }
  }
  &.highlighted {
    border: 1px solid ${(props) => props.theme.accent};
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  .Heading-custom {
    margin-left: 10px;
  }

  .Heading-custom ~ ${TextAreaContainer} {
    margin-top: 5px;
  }
`;

export const ErrorMessage = styled.div`
  position: absolute;
  bottom: -20px;
  &.none {
    display: none;
  }
  color: ${(props) => props.theme.accentDanger};
  opacity: 1;
  margin-left: 10px;
  font-size: var(--font-size-xs);
  pointer-events: none;
`;
