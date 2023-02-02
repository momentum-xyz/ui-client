import styled from 'styled-components';

// TODO try css masonry layout

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 50px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

export const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const Section = styled.div`
  display: flex;
  // flex: 1 0 auto;
  position: relative;
`;
