import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.text};
  gap: 10px;
`;
