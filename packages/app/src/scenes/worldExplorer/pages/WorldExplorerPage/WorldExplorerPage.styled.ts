import styled from 'styled-components';

export const WorldExplorerPageContainer = styled.div<{background: string}>`
  background-image: url(${(props) => props.background});
  height: 100vh;
  width: 100vw;
  background-size: cover;
  padding: 10px;
`;
