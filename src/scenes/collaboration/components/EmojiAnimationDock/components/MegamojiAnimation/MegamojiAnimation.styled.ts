import styled from 'styled-components';

export const MegamojiContainer = styled.div`
  position: absolute;
  // position: fixed;
  top: 100%;
  // left: 50%;
  opacity: 0;
  width: 150px;
  height: 150px;
  transform-origin: 50% 50%;
  animation-name: megamoji;
  animation-duration: 2s;
  animation-timing-function: linear;
  // animation-iteration-count: infinite;

  @keyframes megamoji {
    0% {
      transform: scale(0.2);
      transform-origin: 50% 50%;
      opacity: 0;
      top: 100%;
    }
    30% {
      top: 70%;
      transform: rotate(0deg) scale(0.5);
      transform-origin: 50% 50%;
      opacity: 1;
    }
    60% {
      top: 70%;
      transform: rotate(-360deg) scale(1);
      transform-origin: 50% 50%;
      opacity: 1;
    }
    90% {
      top: 70%;
      transform: rotate(-360deg) scale(1.3);
      transform-origin: 50% 50%;
      opacity: 1;
    }
    100% {
      top: 70%;
      transform: rotate(-360deg);
      transform-origin: 50% 50%;
      opacity: 0;
    }
  }
`;

export const MegamojiImg = styled.img`
  width: 150px;
  height: 150px;
  position: absolute;
  // top: 0px;
  // left: 0px;
`;
