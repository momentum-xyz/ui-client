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
  pointer-events: none;
`;

export const InnerContainer = styled.div`
  display: flex;
  // width: 100%;
  // height: 100%;
`;

export const Section = styled.div`
  display: flex;
  // flex: 1 0 auto;
  position: relative;
  padding: 10px;
  gap: 10px;
`;

export const ContainerG = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, auto));
  grid-template-rows: minmax(0, auto) minmax(0, auto);
  grid-gap: 10px;
  grid-template-areas:
    'left-top left-top left-top right-top right-top right-top'
    'left-bottom left-bottom left-bottom right-bottom right-bottom right-bottom';

  width: 100%;
  height: calc(100% - 50px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;

  .section-screen-item {
    display: flex;
    justify-content: end;
  }

  .left-top:nth-child(1),
  .left-bottom:nth-child(1) {
    grid-column: 1 / 2;
  }
  .left-top:nth-child(2),
  .left-bottom:nth-child(2) {
    grid-column: 2 / 3;
  }
  .left-top:nth-child(3),
  .left-bottom:nth-child(3) {
    grid-column: 3 / 4;
  }

  .right-top:nth-child(1),
  .right-bottom:nth-child(1) {
    grid-column: 6 / 7;
  }
  .right-top:nth-child(2),
  .right-bottom:nth-child(2) {
    grid-column: 5 / 6;
  }
  .right-top:nth-child(3),
  .right-bottom:nth-child(3) {
    grid-column: 4 / 5;
  }

  .left-top {
    grid-area: left-top;
    flex-grow: 1;
  }
  .right-top {
    grid-area: right-top;
  }
  .left-bottom {
    grid-area: left-bottom;
  }
  .right-bottom {
    // grid-column: 2 / 3;
    // grid-row: 2 / 3;
    grid-area: right-bottom;
  }
`;

export const SectionG = styled.div`
  // &.top-left {
  //   grid-column: 1 / 2;
  //   grid-row: 1 / 2;
  // }
  // &.top-right {
  //   grid-column: 2 / 3;
  //   grid-row: 1 / 2;
  // }
  // &.bottom-left {
  //   grid-column: 1 / 2;
  //   grid-row: 2 / 3;
  // }
  // &.bottom-right {
  //   grid-column: 2 / 3;
  //   grid-row: 2 / 3;
  // }
`;
