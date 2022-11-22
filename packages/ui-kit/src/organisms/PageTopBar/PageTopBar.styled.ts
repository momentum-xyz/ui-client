import styled from 'styled-components';
import {rgba} from 'polished';

export const Titles = styled.div`
  display: flex;
  min-width: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 20px;
`;

export const ChildrenContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-grow: 1;
  margin: 0 20px;
  flex-shrink: 0;
`;

export const Title = styled.div`
  min-width: 0;
`;
export const SubTitle = styled.div`
  min-width: 0;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  height: 60px;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  pointer-events: all;
  z-index: calc(var(--base-z-index) + 1);

  ${Title} ~ ${SubTitle} {
    margin-left: 1ch;
  }
`;
