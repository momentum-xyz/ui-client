import styled from 'styled-components';
import {rgba} from 'polished';

import {Item} from 'ui-kit/molecules/NavigationBarItem/NavigationBarItem.styled';

export const Container = styled.nav`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  width: 60px;
  border-radius: 9px;
  display: flex;
  flex-direction: column;

  ${Item} ~ ${Item} {
    margin-top: 10px;
  }
`;
