import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  width: 320px;

  &.wide {
    width: 100%;
  }

  .Select__control {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
    border-radius: 4px;
    box-shadow: none;
    transition: background var(--tr-150-ei);

    &:hover {
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
      border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
      color: ${(props) => props.theme.accentText};
      cursor: pointer;

      .Select__single-value {
        color: ${(props) => props.theme.accentText};
      }

      svg {
        transition: color var(--tr-150-ei), transform var(--tr-150-ei);
        color: ${(props) => props.theme.accentText};
      }
    }
  }

  .Select--is-disabled {
    pointer-events: auto;
    cursor: not-allowed;
  }

  .Select__control--is-disabled {
    pointer-events: none;
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  }

  .Select__indicator {
    padding: 0 16px;
  }

  .Select__dropdown-indicator {
    svg {
      transition: color var(--tr-150-ei), transform var(--tr-150-ei);
      color: ${(props) => props.theme.text};
    }
  }

  .Select__control--menu-is-open {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
    border: 1px solid transparent;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    outline: none;

    &:hover {
      border: 1px solid transparent;
    }

    .Select__dropdown-indicator {
      svg {
        transform: rotate(180deg);
      }
    }
  }

  .Select__placeholder {
    margin-left: 12px;
    color: ${(props) => props.theme.text};
    font-size: var(--font-size-m);
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .Select__input-container {
    margin-left: 12px;
    color: ${(props) => props.theme.text};
  }

  .Select__input {
    font-size: var(--font-size-m);
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .Select__single-value {
    margin-left: 12px;
    color: ${(props) => props.theme.text};
    font-size: var(--font-size-m);
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .Select__menu {
    margin: 0;
    box-shadow: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: transparent;
  }

  .Select__menu-list {
    padding: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .Select__menu-notice--no-options {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
    color: ${(props) => props.theme.text};
    font-size: var(--font-size-m);
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .Select__option {
    padding: 10px 20px;
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
    color: ${(props) => props.theme.text};
    font-size: var(--font-size-m);
    font-weight: 400;
    letter-spacing: 0.5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .Select__option:nth-child(odd) {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  }

  .Select__option--is-focused {
    color: ${(props) => props.theme.accentText};
    cursor: pointer;
  }
`;
