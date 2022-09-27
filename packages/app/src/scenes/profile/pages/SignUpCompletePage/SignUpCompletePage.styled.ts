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

export const LogoContainer = styled.div`
  padding: 8px 0 32px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Logo = styled.img`
  height: 48px;
  width: 300px;
`;

export const Wrapper = styled.div`
  width: 530px;
  padding: 36px;
`;
