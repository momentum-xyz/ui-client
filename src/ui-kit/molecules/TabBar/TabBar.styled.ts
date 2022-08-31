import styled from 'styled-components';
import {rgba} from 'polished';

export const TabBar = styled.div`
  display: flex;
  width: 100%;
  min-width: 250px;
  height: 30px;
  line-height: 1;
  border-radius: 11px;
  background: transparent;

  text-transform: uppercase;
  color: ${(props) => props.theme.accent};
  font-size: var(--font-size-xs);
  font-weight: 500;

  border: 1px solid ${(props) => props.theme.accent};
  align-items: center;
  overflow: hidden;
`;

export const Tab = styled.button`
  height: 100%;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent};
  overflow: hidden;
  padding: 0px 8px;
  transition: background var(--tr-100-ei), color var(--tr-100-ei);

  .tab-bar-svg {
    margin-right: 5px;
  }

  .tab-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  }
  &.active {
    color: var(--black);
    background: ${(props) => props.theme.accent};

    .tab-bar-svg {
      color: var(--black);
    }
  }
`;
export const DropdownIcon = styled.div`
  position: absolute;
  z-index: 3;
  line-height: 26px;
  padding: 0 12px;
  right: 0;
  top: 6px;
  transition: transform var(--tr-100-ei);

  &.is-open {
    transform: rotate(180deg);
  }
`;

export const DropdownOptionsList = styled.div`
  display: block;
  position: relative;
  z-index: 2;
  width: 100%;
  background: black;
  padding: 6px 11px;
  border-radius: 11px;
  text-align: left;

  li {
    color: ${(props) => props.theme.text};
    opacity: 0.7;
    margin-bottom: 8px;
    transition: color var(--tr-100-ei), opacity var(--tr-100-ei);

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
  }
`;
