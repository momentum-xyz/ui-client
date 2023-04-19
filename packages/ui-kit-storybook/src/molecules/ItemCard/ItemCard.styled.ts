import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
  margin: 0 1px;
  padding: 10px;
  display: grid;
  font-size: var(--font-size-m);
  background: ${(props) => props.theme.bg && rgba(props.theme.accentBg, 0.2)};
  box-shadow: -1px -1px 2px ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  border-radius: 4px;

  &.normal {
    grid-template-columns: 35% 1fr;
    gap: 20px;
  }

  &.small {
    grid-template-columns: 40% 1fr;
    gap: 10px;
  }
`;

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.text};

  &.normal {
    gap: 10px;
  }

  &.small {
    gap: 8px;
  }
`;

export const ItemNameContainer = styled.div`
  padding: 2px 0 0 0;
`;

export const ItemName = styled.div`
  text-transform: uppercase;
  letter-spacing: 0.2em;

  &.normal {
    line-height: var(--font-size-xl);
    font-size: var(--font-size-xl);
    font-weight: 700;
  }

  &.small {
    line-height: var(--font-size-s);
    font-size: var(--font-size-s);
    font-weight: 600;
  }

  > span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const ItemLink = styled.a``;

export const ItemDesc = styled.div`
  &.normal {
    font-size: var(--font-size-m);
    line-height: 22px;
  }

  &.small {
    font-size: var(--font-size-s);
    line-height: 18px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;