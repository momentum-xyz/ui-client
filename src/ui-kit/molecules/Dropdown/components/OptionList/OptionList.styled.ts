import styled from 'styled-components';
import {rgba} from 'polished';

import {ComponentSizeInterface} from 'ui-kit';

export const DropdownOptionsList = styled.div<{size?: ComponentSizeInterface}>`
  --borderRadius: initial;

  position: absolute;
  display: block;
  width: 100%;
  background: black;
  padding: 9px 11px;
  border-radius: var(--borderRadius);
  text-align: left;
  z-index: 200;
  overflow-y: scroll;

  ${(props) => (props.size?.maxHeight ? `max-height: ${props.size.maxHeight};` : '')}
  ${(props) => (props.size?.maxWidth ? `max-width: ${props.size.maxWidth};` : '')}
  ${(props) => (props.size?.height ? `height: ${props.size.height};` : '')}
  ${(props) => (props.size?.width ? `width: ${props.size.width};` : '')}

  &.primary {
    --borderRadius: 11px;
  }

  &.secondary {
    --borderRadius: 5px;
  }
`;

export const DropdownIcon = styled.div`
  position: absolute;
  padding: 0 12px;
  width: 38px;
  transition: transform var(--tr-100-ei);
  right: 0;

  &.opened {
    transform: rotate(180deg);
  }
`;

export const DropdownOption = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.text};
  margin-bottom: 8px;
  transition: color var(--tr-100-ei), opacity var(--tr-100-ei);
  opacity: 0.7;
  cursor: pointer;

  .IconSvg-custom {
    margin-right: 5px;
  }

  &:last-child {
    margin-bottom: 0px;
  }

  &:hover {
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
    opacity: 1;
  }

  &.selected {
    opacity: 1;
  }
`;
