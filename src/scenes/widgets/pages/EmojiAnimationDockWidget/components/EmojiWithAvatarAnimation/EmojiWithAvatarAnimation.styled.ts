import styled from 'styled-components';

export const EmojiContainer = styled.div`
  position: absolute;
  // position: fixed;
  top: 100%;
  // left: 45%;
  width: 48px;
  height: 48px;
  transform-origin: 50% 50%;
  animation-name: emojicontainer;
  animation-duration: 3s;
  // animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes emojicontainer {
    0% {
      top: 100%;
      transform: rotateY(0deg);
      transform-origin: 50% 50%;
    }
    20% {
      transform: rotateY(0deg);
      transform-origin: 50% 50%;
    }
    35% {
      transform: rotateY(180deg);
      transform-origin: 50% 50%;
    }
    100% {
      top: 50%;
      transform: rotateY(180deg);
      opacity: 0;
      transform-origin: 50% 50%;
    }
  }
`;

export const EmojiImg = styled.img`
  position: absolute;
  animation-name: emoji;
  animation-duration: 3s;
  opacity: 0;
  animation-timing-function: linear;
  // animation-iteration-count: infinite;
  // left: 0px;
  // right: 0px;
  width: 48px;
  height: 48px;

  @keyframes emoji {
    0% {
      opacity: 0;
      transform: rotateZ(0deg) scale(0.5);
      transform-origin: 50% 50%;
    }
    20% {
      opacity: 0;
      transform: rotateZ(0deg) scale(1);
      transform-origin: 50% 50%;
    }
    25% {
      opacity: 1;
      transform: rotateZ(0deg) scale(1);
      transform-origin: 50% 50%;
    }
    35% {
      opacity: 1;
      transform: scale(1.6);
    }
    90% {
      opacity: 1;
      transform: scale(1.3);
    }
    100% {
      opacity: 0;
      transform: rotateZ(360deg) scale(0.5);
      transform-origin: 50% 50%;
    }
  }
`;

export const Avatar = styled.div`
  position: absolute;
  animation-name: avatar;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  left: 0px;
  right: 0px;
  width: 32px;
  height: 32px;

  @keyframes avatar {
    0% {
      opacity: 1;
      transform: rotateZ(0deg) scale(0.5);
      transform-origin: 50% 50%;
    }
    20% {
      opacity: 1;
      transform: rotateZ(0deg) scale(1);
      transform-origin: 50% 50%;
    }
    25% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: rotateZ(360deg);
    }
  }
`;

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
      // dmitry test
      top: 90%;
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
