import styled from 'styled-components';
import {rgba} from 'polished';

export const Inner = styled.div`
  --message-padding: 15px;
  --message-margin: 80px;
  --message-height: 42px;
  --message-radius: 20px;
  --rabbit-height: 120px;
  --first-rabbit-width: 70px;
  --second-rabbit-width: 131px;
  --third-rabbit-width: 107px;

  position: fixed;
  background-color: ${(props) => props.theme.bg};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
`;

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RabbitWrapper = styled.div`
  display: grid;
  grid-template-columns: 75px 107px 107px 75px;
`;

export const Image = styled.img`
  margin: 0 0 20px 0;
  width: var(--flamingo-size);
  height: var(--flamingo-size);
`;

export const SecondRabbit = styled.img`
  opacity: 0;
  width: var(--second-rabbit-width);
  height: var(--rabbit-height);
  &.rabbit2 {
    animation-name: rabbit2;
    animation-duration: 1s;
    opacity: 0;
    animation-timing-function: ease-in-out;
    width: var(--second-rabbit-width);
    height: var(--rabbit-height);

    @keyframes rabbit2 {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`;

export const ThirdRabbit = styled.img`
  opacity: 0;
  width: var(--third-rabbit-width);
  height: var(--rabbit-height);
  &.rabbit3 {
    animation-name: rabbit3;
    animation-duration: 1s;
    opacity: 0;
    animation-timing-function: ease-in-out;
    width: var(--third-rabbit-width);
    height: var(--rabbit-height);
    animation-direction: alternate;
    @keyframes rabbit3 {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`;

export const FourthRabbit = styled.img`
  opacity: 0;
  width: var(--first-rabbit-width);
  height: var(--rabbit-height);
  &.rabbit4 {
    animation-name: rabbit4;
    animation-duration: 1s;
    opacity: 0;
    animation-timing-function: ease-in-out;
    width: var(--first-rabbit-width);
    height: var(--rabbit-height);

    @keyframes rabbit4 {
      0% {
        opacity: 1;
        transform: rotateY(180deg);
      }
      99% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`;

export const FirstRabbit = styled.img`
  opacity: 0;
  width: var(--first-rabbit-width);
  height: var(--rabbit-height);
  &.rabbit {
    animation-name: rabbit;
    animation-duration: 1s;
    opacity: 0;
    animation-timing-function: ease-in-out;
    width: var(--first-rabbit-width);
    height: var(--rabbit-height);

    @keyframes rabbit {
      0% {
        opacity: 1;
        transform: rotateY(180deg);
      }
      99% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`;

export const FifthRabbit = styled.img`
  opacity: 0;
  width: var(--second-rabbit-width);
  height: var(--rabbit-height);
  &.rabbit5 {
    animation-name: rabbit5;
    animation-duration: 1s;
    opacity: 0;
    animation-timing-function: ease-in-out;
    width: var(--second-rabbit-width);
    height: var(--rabbit-height);
    animation-direction: alternate;
    @keyframes rabbit5 {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`;

export const SixthRabbit = styled.img`
  opacity: 0;
  width: var(--third-rabbit-width);
  height: var(--rabbit-height);
  &.rabbit6 {
    animation-name: rabbit6;
    animation-duration: 1s;
    opacity: 0;
    animation-timing-function: ease-in-out;
    width: var(--third-rabbit-width);
    height: var(--rabbit-height);
    animation-direction: alternate;
    @keyframes rabbit6 {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
`;

export const Version = styled.div`
  opacity: 0.5;
  padding-top: 20px;
`;

export const MessageWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  bottom: 0;
  left: 0;
  right: 0;
`;

export const Message = styled.div`
  display: flex;
  padding: 0 var(--message-padding);
  margin: 0 0 var(--message-margin) 0;
  height: var(--message-height);
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.theme.accentText};
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xs);
  border-radius: var(--message-radius);
`;

export const Link = styled.a`
  padding: 0 0 0 5px;
  color: ${(props) => props.theme.accentText};
  font-size: var(--font-size-xs);
`;
