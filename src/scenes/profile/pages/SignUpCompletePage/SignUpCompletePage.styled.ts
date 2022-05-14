import styled from 'styled-components';

export const Background = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-size: cover;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const Logo = styled.img`
  margin: 8px auto 32px auto;
  height: 48px;
  width: 300px;
`;

export const Wrapper = styled.div`
  width: 530px;
  padding: 36px;
`;
