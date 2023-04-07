import styled from 'styled-components';
import {rgba} from 'polished';

export const AddEventContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  overflow: visible;
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 1)};
  border-radius: 7px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 1)};
  width: 100%;
  padding-top: 30px;
  top: 0;
  z-index: -1;

  a {
    padding: 10px;

    &:hover {
      color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 1)};
    }
  }

  a ~ a {
    border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  }
`;
