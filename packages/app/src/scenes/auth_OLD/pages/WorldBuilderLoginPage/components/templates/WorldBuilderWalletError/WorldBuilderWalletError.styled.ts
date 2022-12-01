import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-m);
`;

export const Error = styled.div`
  color: ${(props) => props.theme.accentDanger};
  text-align: center;
  width: 60%;
`;
