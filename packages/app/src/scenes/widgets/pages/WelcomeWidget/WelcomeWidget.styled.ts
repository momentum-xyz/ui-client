import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  height: calc(100vh - 90px);
`;

export const Hexagons = styled.div`
  position: relative;
`;

export const TopHexagons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const BottomHexagon = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  top: 292px;
`;

export const BigHexagon = styled.div`
  pointer-events: all;

  &.hexagon {
    cursor: default;
    position: relative;
    width: 320px;
    height: 184.75208614068026px;
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 1)};
    margin: 92.37604307034013px auto 0 auto;
    box-shadow: 0 0 0px rgba(0, 255, 255, 1);
    border-left: solid 1px ${(props) => props.theme.accentText};
    border-right: solid 1px ${(props) => props.theme.accentText};
    display: grid;
    transition: 0s;
  }

  &.hexagon:before,
  &.hexagon:after {
    content: '';
    position: absolute;
    z-index: 1;
    width: 226.2741699796952px;
    height: 226.2741699796952px;
    transform: scaleY(0.5774) rotate(-45deg);
    background-color: inherit;
    left: 45.862915010152406px;
    box-shadow: 0 0 0px rgba(0, 255, 255, 1);
    transition: 0s;
  }

  &.hexagon:before {
    top: -113.1370849898476px;
    border-top: solid 1.4142135623730951px ${(props) => props.theme.accentText};
    border-right: solid 1.4142135623730951px ${(props) => props.theme.accentText};
  }

  &.hexagon:after {
    bottom: -113.1370849898476px;
    border-bottom: solid 1.4142135623730951px ${(props) => props.theme.accentText};
    border-left: solid 1.4142135623730951px ${(props) => props.theme.accentText};
  }

  &.hexagon span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    font-size: 25px;
    color: #f47721;
    top: 0.5773502691896257px;
    left: 0;
    width: 318px;
    height: 183.5974px;
    z-index: 2;
    background: inherit;
    transition: 0s;
  }
`;
