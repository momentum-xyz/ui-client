import styled from 'styled-components';
import {rgba} from 'polished';

export const Item = styled.div`
  .NavLink {
    display: flex;
    background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    border-radius: 10px;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    flex: none;
    order: 1;
    flex-grow: 0;

    align-items: center;
    justify-content: center;

    width: 60px;
    height: 60px;
  }

  .active {
    border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};

    div.icon {
      opacity: 1;
    }
  }

  &.isHide {
    display: none;
  }

  div.icon {
    height: 24px;
    width: 24px;
    opacity: 0.3;
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};

    &.hovered {
      opacity: 1;
    }

    &.isActive:not(&.hovered) {
      @keyframes pulse {
        from {
          opacity: 0.3;
        }

        to {
          opacity: 1;
        }
      }

      animation: pulse 1s ease-in-out alternate infinite;
    }

    svg {
      fill: currentColor;
    }
  }
`;
