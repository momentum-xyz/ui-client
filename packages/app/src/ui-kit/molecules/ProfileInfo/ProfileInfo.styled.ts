import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  padding: 0 0 20px 0;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  gap: 10px;
`;

export const Hash = styled.div`
  text-decoration: underline;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-style: italic;
  overflow: hidden;
`;

export const LinkAccent = styled.a`
  color: ${(props) => props.theme.accentText};
`;

export const Actions = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  gap: 10px;
`;
