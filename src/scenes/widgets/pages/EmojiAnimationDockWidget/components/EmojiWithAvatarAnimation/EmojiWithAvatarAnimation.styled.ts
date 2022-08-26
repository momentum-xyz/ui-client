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

export const Avatar = styled.img`
  position: absolute;
  animation-name: avatar;
  animation-duration: 3s;
  animation-timing-function: linear;
  opacity: 0;
  // animation-iteration-count: infinite;
  // left: 0px;
  // right: 0px;
  width: 32px;
  height: 32px;
  border-radius: 50%;

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
