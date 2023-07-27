import styled from 'styled-components';

export const Container = styled.div<{fill?: boolean}>`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.fill &&
    `
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    border-radius: inherit;
    background-color: rgba(0, 0, 0, 0.5);
  `}

  @keyframes blink {
    0% {
      opacity: 0.2;
    }
    20% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.2;
    }
  }
`;

export const Item = styled.div`
  margin: 4px;
  width: 6px;
  height: 6px;
  background: ${(props) => props.theme.text};
  border-radius: 50%;

  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;
