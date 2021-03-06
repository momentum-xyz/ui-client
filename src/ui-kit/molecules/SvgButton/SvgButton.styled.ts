import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.button`
  display: flex;
  cursor: pointer;

  :disabled {
    .IconSvg-custom {
      opacity: 0.2;
    }
  }

  :not(:disabled) {
    .IconSvg-custom {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.7)};

      &.danger {
        color: var(--danger);
      }

      :hover {
        color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)} !important;
      }
    }
  }
`;
