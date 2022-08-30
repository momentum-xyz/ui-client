import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const PageContainer = styled.div`
  position: absolute;
  z-index: 2;

  width: 100vw;
  height: 100vh;
`;

export const BackgroundFilter = styled.div`
  position: absolute;
  background: linear-gradient(90deg, rgba(12, 36, 66, 0.68) 1.7%, rgba(12, 36, 66, 0.8) 103.87%);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  z-index: 1;

  width: 100vw;
  height: 100vh;
`;

export const Background = styled.img`
  position: absolute;
  z-index: 0;
  height: 100%;
`;
