import styled from 'styled-components';

export const TextAreaContainer = styled.div`
  --textarea-padding: 6px 18px;
  --textarea-radius: 12px;

  position: relative;

  textarea {
    display: block;
    width: 100%;
    height: auto;
    padding: var(--textarea-padding);
    border: 1px solid rgba(0, 0, 0, 0.8);
    border-radius: var(--textarea-radius);
    background-color: rgba(0, 0, 0, 0.8);
    font-size: var(--font-size-xs);
    color: ${(props) => props.theme.text};
    font-weight: 700;
    outline: none;
    resize: none;

    &:hover,
    &:active {
      border: 1px solid ${(props) => props.theme.accent};
    }

    &:disabled {
      opacity: 0.5;
      border: 1px solid rgba(0, 0, 0, 0.8);
    }
  }
`;
