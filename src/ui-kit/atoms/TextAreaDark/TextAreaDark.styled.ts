import styled from 'styled-components';

export const TextAreaContainer = styled.div`
  --textarea-padding: 14px 18px;
  --textarea-radius: 12px;

  position: relative;

  textarea {
    display: block;
    width: 100%;
    height: auto;
    padding: var(--textarea-padding);
    border: 1px solid var(--black-100);
    border-radius: var(--textarea-radius);
    background-color: var(--black-100);
    font-size: var(--font-size-xs);
    font-weight: 700;
    outline: none;

    &:hover,
    &:active {
      border: 1px solid ${(props) => props.theme.accent};
    }
  }
`;
