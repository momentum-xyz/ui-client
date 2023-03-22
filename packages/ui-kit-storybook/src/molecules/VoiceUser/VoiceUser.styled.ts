import styled from 'styled-components';
import {rgba} from 'polished';

const BROWN = '#bb7851';
const YELLOW = '#eae71b';

export const Container = styled.div`
  display: flex;
  height: 124px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background: ${rgba(BROWN, 0.6)};

  &.active {
    background: ${rgba(YELLOW, 0.2)};
  }

  > button {
    scale: 1.5;
  }
`;
