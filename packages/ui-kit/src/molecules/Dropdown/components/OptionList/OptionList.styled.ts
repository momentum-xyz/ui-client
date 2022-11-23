import styled from 'styled-components';
import {rgba} from 'polished';

import {IconSvg} from '../../../../atoms';
import {ComponentSizeInterface} from '../../../../interfaces';

export const DropdownOptionsList = styled.div<{size?: ComponentSizeInterface}>`
  --borderRadius: initial;
  --padding: initial;
  --min-height: initial;

  position: absolute;
  display: block;
  width: 100%;
  min-height: var(--min-height);
  background: black;
  padding: var(--padding);
  border-radius: var(--borderRadius);
  text-align: left;
  z-index: 200;
  overflow-y: scroll;

  &.primary {
    --padding: 9px 11px;
    --borderRadius: 11px;
  }

  &.secondary {
    --padding: 9px 11px;
    --borderRadius: 5px;
  }

  &.third {
    --padding: 9px 11px;
    --borderRadius: 11px;
    --min-height: 27px;
  }

  &.normal {
    max-height: 300px;
  }

  &.small {
    max-height: 115px;
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

export const OptionListIcon = styled(IconSvg)`
  margin-right: 5px;
`;
