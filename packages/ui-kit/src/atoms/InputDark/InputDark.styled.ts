import styled from 'styled-components';

export const InputContainer = styled.div`
  --input-height: 26px;
  --input-padding: 0 18px;
  --input-radius: 12px;

  position: relative;

  input {
    display: block;
    width: 100%;
    padding: var(--input-padding);
    height: var(--input-height);
    border: 1px solid var(--black-100);
    border-radius: var(--input-radius);
    background-color: var(--black-100);
    font-size: var(--font-size-xs);
    color: ${(props) => props.theme.text};
    font-weight: 700;
    outline: none;

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
  font-size: var(--font-size-xxs);
  text-transform: uppercase;
  font-weight: 500;
  right: 5px;
  top: 27px;
`;
