import styled from 'styled-components';

export const Background = styled.div<{background: string}>`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url(${(props) => props.background});
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const Container = styled.div`
  height: 100%;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-m);
`;
