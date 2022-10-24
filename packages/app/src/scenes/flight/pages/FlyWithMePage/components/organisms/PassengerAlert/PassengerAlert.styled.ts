import styled from 'styled-components';
import {rgba} from 'polished';

export const Content = styled.div`
  margin: 10px 0 0 0;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
`;
