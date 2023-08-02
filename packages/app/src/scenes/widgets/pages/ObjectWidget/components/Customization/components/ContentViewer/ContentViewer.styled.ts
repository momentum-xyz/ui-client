import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Wrapper = styled.div`
  position: relative;
`;

export const Title = styled.div`
  padding: 0 0 10px 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 3.2px;
  text-transform: uppercase;
`;

export const Grid = styled.div`
  margin: 0 0 20px 0;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  gap: 10px;
`;

export const Opinion = styled.div`
  padding: 2px 0 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Description = styled.div`
  white-space: pre-line;
  line-height: 20px;
  letter-spacing: 0.56px;
`;

export const Controls = styled.div``;

export const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
