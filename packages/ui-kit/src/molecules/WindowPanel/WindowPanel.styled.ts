import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;

  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  border-radius: 10px 10px 0px 0px;

  width: 100%;
  height: 100%;

  &:not(.expanded) {
    max-height: 420px;
    aspect-ratio: 16 / 9;
  }

  transition: all 0.2s ease-in-out;
`;

export const Content = styled.div`
  flex: 1 0 auto;
  width: 100%;
`;
