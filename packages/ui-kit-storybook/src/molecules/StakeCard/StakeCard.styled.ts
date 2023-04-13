import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
  margin: 0 1px;
  padding: 10px;
  display: grid;
  grid-template-columns: 170px 1fr;
  background: ${(props) => props.theme.bg && rgba(props.theme.accentBg, 0.2)};
  box-shadow: -1px -1px 2px ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  border-radius: 4px;
  gap: 10px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.text};
  overflow: hidden;
`;

export const Name = styled.div`
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: var(--font-size-xl);
  font-size: var(--font-size-xl);
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const Actions = styled.div`
  padding: 0 0 0 2px;
  display: flex;
  gap: 8px;
`;

export const Totals = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-m);
  gap: 6px;
`;

export const TotalLine = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  align-items: center;
`;

export const TokensAmount = styled.div`
  padding: 4px 10px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  border-radius: 4px;
  font-size: var(--font-size-s);
  letter-spacing: 0.02em;
  text-align: right;

  > span {
    font-weight: 700;
  }
`;
