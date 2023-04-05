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

export const FlightWithMeTextItem = styled.div`
  margin: -15px 0 0 0;
  padding: 0 0 20px 0px;
  font-size: var(--font-size-xs);
  opacity: 0.5;
`;
