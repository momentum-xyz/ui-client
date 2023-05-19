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
  letter-spacing: 0.3em;

  visibility: hidden;
  &.visible {
    visibility: visible;
  }

  position: absolute;
  bottom: calc(100% + 7px);
  z-index: 999;

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
export const TooltipTrigger = styled.div``;
