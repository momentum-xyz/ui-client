import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  grid-template-columns: 30px 1fr;
  align-items: center;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-m);
  letter-spacing: 0.02em;
  font-weight: 400;
  gap: 10px;
`;
