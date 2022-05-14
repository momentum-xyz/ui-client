import styled from 'styled-components';
import {rgba} from 'polished';

export const AddEventContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  a {
    padding: 10px;

    &:hover {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }
  }

  a ~ a {
    border-top: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  }
`;
