import styled from 'styled-components';

export const InputContainer = styled.div`
  --input-height: inherit;
  --input-padding: inherit;
  --input-radius: inherit;

  position: relative;

  input {
    display: block;
    width: 100%;
    padding: var(--input-padding);
    height: var(--input-height);
    border: 1px solid var(--black-100);
    border-radius: var(--input-radius);
    background-color: var(--black-100);
    color: ${(props) => props.theme.text};
    outline: none;

    &.primary {
      --input-padding: 0 18px;
      --input-height: 26px;
      --input-radius: 12px;

      font-size: var(--font-size-xs);
      font-weight: 700;
    }

    &.secondary {
      --input-padding: 0 10px;
      --input-height: 32px;
      --input-radius: 10px;

      font-size: var(--font-size-xxs);
      font-weight: 500;

      &::placeholder {
        text-transform: uppercase;
      }
    }

    &:hover,
    &:active {
      border: 1px solid ${(props) => props.theme.accent};
    }

    &.error {
      border: 1px solid ${(props) => props.theme.accentDanger};
    }
  }
`;

export const Error = styled.div`
  position: absolute;
  color: ${(props) => props.theme.accentDanger};
  text-transform: uppercase;
  font-weight: 500;

  &.primary {
    font-size: var(--font-size-xxxxs);
    left: 10px;
    top: 26px;
  }

  &.secondary {
    font-size: var(--font-size-xxxxs);
    top: 35px;
    left: 5px;
    right: 5px;
  }
`;
