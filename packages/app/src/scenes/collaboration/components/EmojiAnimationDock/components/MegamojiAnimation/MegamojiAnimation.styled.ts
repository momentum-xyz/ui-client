import styled from 'styled-components';

export const MegamojiContainer = styled.div`
  position: absolute;
  height: 220px;
  width: 220px;
  opacity: 0;
  top: 30%;

  z-index: calc(var(--overlay-z-index) + 2);
  transform-origin: 50% 50%;

  animation-name: megamoji;
  animation-duration: 2s;
  animation-timing-function: linear;

  @keyframes megamoji {
    0% {
      top: 30%;
      transform: scale(0.2);
      transform-origin: 50% 50%;
      opacity: 0;
    }
    30% {
      top: 30%;
      transform: rotate(0deg) scale(0.5);
      transform-origin: 50% 50%;
      opacity: 1;
    }
    60% {
      top: 35%;
      transform: rotate(-360deg) scale(1.1);
      transform-origin: 50% 50%;
      opacity: 1;
    }
    90% {
      top: 40%;
      transform: rotate(-360deg) scale(1.5);
      transform-origin: 50% 50%;
      opacity: 1;
    }
    100% {
      top: 40%;
      transform: rotate(-360deg);
      transform-origin: 50% 50%;
      opacity: 0;
    }
  }
`;

export const MegamojiImg = styled.img`
  width: 220px;
  height: 220px;
  position: absolute;
`;
