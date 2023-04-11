import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 10px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  color: ${(props) => props.theme.text};
  border-radius: 4px;
`;

export const Header = styled.div`
  padding: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  font-size: var(--font-size-l);
  text-transform: uppercase;
  font-weight: 600;
  gap: 10px;
`;

export const NameContainer = styled.div`
  min-width: 0;
  overflow: hidden;
`;

export const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 22px;
`;

export const Content = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ItemLabel = styled.div`
  font-size: var(--font-size-m);
  font-weight: 400;
`;
