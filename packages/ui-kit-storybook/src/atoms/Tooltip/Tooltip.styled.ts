import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const Tooltip = styled.span`
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  color: ${(props) => props.theme.text};
  font-family: 'Poppins';
  padding: 4px 10px;
  text-transform: uppercase;
  width: max-content;

  display: none;
  &.visible {
    display: initial;
  }

  position: absolute;
  bottom: calc(100% + 7px);

  &.right {
    left: 50%;
    :after {
      content: '';
      display: block;
      left: 0;
      bottom: -7px;
      position: absolute;
      width: 0;
      height: 0;
      border-left: 0px solid transparent;
      border-right: 7px solid transparent;
      border-top: 7px solid ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
    }
  }
  &.left {
    right: 50%;
    :after {
      content: '';
      display: block;
      right: 0;
      bottom: -7px;
      position: absolute;
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 0px solid transparent;
      border-top: 7px solid ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
    }
  }
`;
