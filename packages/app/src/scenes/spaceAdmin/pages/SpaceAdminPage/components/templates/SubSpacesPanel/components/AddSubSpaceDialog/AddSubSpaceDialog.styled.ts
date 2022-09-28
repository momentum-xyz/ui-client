import styled from 'styled-components';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.accentDanger};
  font-size: var(--font-size-xs);
  margin-left: 10px;
`;
