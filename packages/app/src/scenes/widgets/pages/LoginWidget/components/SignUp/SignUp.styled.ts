import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Wrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
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
