import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: transparent;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.text};
`;
