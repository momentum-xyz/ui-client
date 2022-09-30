import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 10px;
`;

export const Action = styled.button`
  background: ${(props) => props.theme.accent};
  padding: 5px;
  border-radius: 10px;
`;
