import styled from 'styled-components';

// this should allow debugging the layout even on prod - just set DEBUG=1 in sessionStorage and refresh
const DEBUG = sessionStorage.getItem('DEBUG') !== null;

export const Container = styled.div`
  pointer-events: none;

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;

  width: 100%;
  height: 100%;

  .sectioned-screen-top-left {
    flex-grow: 1;
    order: 1;
  }
  .sectioned-screen-top-right {
    order: 2;
    justify-content: end;
  }
  .sectioned-screen-bottom-right {
    display: flex;
    justify-content: end;
    order: 10;
    align-self: flex-end;
  }

  .sectioned-screen-top-left,
  .sectioned-screen-top-right {
    height: 60%;
  }
  .sectioned-screen-bottom-right {
    height: 38%;
  }

  .sectioned-screen-section-break {
    flex-basis: 100%;
    height: ${() => (DEBUG ? '2px' : '0')};
    background: ${() => (DEBUG ? 'red' : 'transparent')};
    margin: -5px 0;
    order: 5;
  }

  @supports (selector(:has(div))) {
    .sectioned-screen-section-break {
      display: none;
    }
    .sectioned-screen-top-left,
    .sectioned-screen-top-right {
      height: 100%;
    }
  }

  // right now we're ok with having top-left and bottom-right sections on the same row but alighed differently
  // if we have top-right and bottom-right, then we need to split them into two rows and limit the top row height
  &:has(.sectioned-screen-bottom-right):has(.sectioned-screen-top-right) {
    .sectioned-screen-section-break {
      display: block;
    }
    .sectioned-screen-top-left,
    .sectioned-screen-top-right {
      height: 60%;
    }
  }
`;
