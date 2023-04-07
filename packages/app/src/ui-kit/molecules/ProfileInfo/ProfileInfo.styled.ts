import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LinkAccent = styled.a`
  color: ${(props) => props.theme.accentText};
`;

export const Actions = styled.div`
  padding: 10px 0 20px 0;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  display: flex;
  gap: 10px;
`;
