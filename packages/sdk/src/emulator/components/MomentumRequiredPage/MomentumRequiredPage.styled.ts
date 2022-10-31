import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  overflow: hidden;
`;
