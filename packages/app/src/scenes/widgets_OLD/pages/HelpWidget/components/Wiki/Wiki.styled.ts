import styled from 'styled-components';

export const TextItem = styled.div`
  font-size: var(--font-size-s);
  padding-top: 10px;
`;

export const HighlightedSpan = styled.span`
  font-size: var(--font-size-m);
  font-weight: bold;
  color: ${(props) => props.theme.accentText};
  cursor: pointer;
`;

export const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;
