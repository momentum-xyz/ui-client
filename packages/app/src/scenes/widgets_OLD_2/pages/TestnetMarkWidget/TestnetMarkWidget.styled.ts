import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  right: 15px;
  bottom: 10px;
  z-index: 2;
  opacity: 0.75;

  &.withOffset {
    bottom: 60px;
  }
`;

export const Img = styled.img`
  width: 100px;
`;
