import styled from 'styled-components';
import {rgba} from 'polished';

export const AddEventContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  overflow: visible;
  border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
  border-radius: 7px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 1)};
  width: 100%;
  padding-top: 30px;
  top: 0;
  z-index: -1;

  .Button-custom {
    white-space: nowrap;
  }

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
