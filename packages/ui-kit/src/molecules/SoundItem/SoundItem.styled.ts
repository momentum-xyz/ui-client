import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Inner = styled.div`
  padding: 0 10px;
  display: grid;
  height: 46px;
  grid-template-columns: 1fr auto;
  border: 1px solid transparent;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  box-shadow: -1px -1px 2px 0px rgba(158, 238, 255, 0.1);
  border-radius: 4px;
  gap: 10px;

  &.active {
    border: 1px solid ${(props) => props.theme.accentText};
    box-shadow: none;
  }
`;

export const TitleContainer = styled.div`
  min-width: 0;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: 0.2em;
  justify-content: center;
  align-self: center;
  align-items: start;

  &.active {
    color: ${(props) => props.theme.accentText};
  }
`;

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;
