import styled from 'styled-components';
import {rgba} from 'polished';

export const BigHexagon = styled.div`
  position: relative;
  pointer-events: all;

  &.hex {
    cursor: default;
    position: relative;
    width: 320px;
    height: 184.75208614068026px;
    background-color: var(--blue-bg);
    margin: 92.37604307034013px auto 0 auto;
    box-shadow: 0 0 0 rgba(0, 255, 255, 1);
    border-left: solid 1px ${(props) => props.theme.accentText};
    border-right: solid 1px ${(props) => props.theme.accentText};
    display: grid;
    transition: 0s;

    &.inverse {
      color: ${(props) => props.theme.accentBg};
      background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 1)};
    }
  }

  &.hex:before,
  &.hex:after {
    content: '';
    position: absolute;
    z-index: 1;
    width: 226.2741699796952px;
    height: 226.2741699796952px;
    transform: scaleY(0.5774) rotate(-45deg);
    background-color: inherit;
    left: 45.862915010152406px;
    box-shadow: 0 0 0 rgba(0, 255, 255, 1);
    transition: 0s;
  }

  &.hex:before {
    top: -113.1370849898476px;
    border-top: solid 1.4142135623730951px ${(props) => props.theme.accentText};
    border-right: solid 1.4142135623730951px ${(props) => props.theme.accentText};
  }

  &.hex:after {
    bottom: -113.1370849898476px;
    border-bottom: solid 1.4142135623730951px ${(props) => props.theme.accentText};
    border-left: solid 1.4142135623730951px ${(props) => props.theme.accentText};
  }
`;

export const Inner = styled.div`
  padding: 0 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  top: -60px;
  left: 0;
  z-index: 2;
`;

export const Icon = styled.div`
  svg {
    color: ${(props) => props.theme.accentText};
  }
`;

export const Title = styled.div`
  padding: 16px 0;
  height: 92px;
  font-size: var(--font-size-xxl);
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
`;

export const Message = styled.div`
  padding: 16px 0;
  border-top: 1px solid ${(props) => props.theme.accentText};
  font-size: var(--font-size-xxs);
  font-weight: 600;
  letter-spacing: 2.6px;
  text-transform: uppercase;

  &.inverse {
    border-top: 1px solid ${(props) => props.theme.accentBg};
  }
`;
