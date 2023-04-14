import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --scroll-offset: 360px;
`;

export const ScrollableContainer = styled.div`
  margin: 0 10px;
  padding: 10px 0 0 0;
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;

export const Title = styled.div`
  padding: 16px 0;
  font-weight: 600;
  font-size: var(--font-size-l);
  line-height: 22px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const InputContainer = styled.div``;

export const ReadyText = styled.div`
  padding: 12px 0;
`;
