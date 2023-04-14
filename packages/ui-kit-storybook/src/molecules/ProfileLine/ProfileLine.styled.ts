import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-m);
  letter-spacing: 0.02em;
  font-weight: 400;
  gap: 10px;
`;

export const Label = styled.div`
  padding: 3px 0 0 0;
`;
