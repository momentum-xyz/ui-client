import {rgba} from 'polished';
import styled from 'styled-components';

export const WrapperButton = styled.button``;

export const Wrapper = styled.div`
  --hexagon-border-color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
  --hexagon-accent-color: ${(props) => props.theme.accentBg};

  --hexagon-large-width: 48px;
  --hexagon-large-height: 56px;

  --hexagon-width: 42px;
  --hexagon-height: 49px;

  --hexagon-medium-width: 36px;
  --hexagon-medium-height: 42px;

  --hexagon-small-width: 30px;
  --hexagon-small-height: 35px;

  --border-hexagon-large-width: 60px;
  --border-hexagon-large-height: 70px;

  --hexagon-medium-large-width: 38px; // this one
  --hexagon-medium-large-height: 44px; // this one

  --hexagon-small-blank-width: 28px; // small blank
  --hexagon-small-blank-height: 33px; // small blank

  --border-hexagon-small-width: 48px; // smaller bordered
  --border-hexagon-small-height: 56px; // smaller bordered

  position: relative;

  width: var(--hexagon-width);
  height: var(--hexagon-height);

  &.small {
    width: var(--hexagon-small-width);
    height: var(--hexagon-small-height);
    &:not(.borderless) {
      &:after {
        width: var(--hexagon-small-width);
        height: var(--hexagon-small-height);
      }
      &:before {
        width: var(--hexagon-small-width);
        height: var(--hexagon-small-height);
      }
    }
  }
  &.medium {
    width: var(--hexagon-medium-width);
    height: var(--hexagon-medium-height);
  }
  &.large {
    width: var(--hexagon-large-width);
    height: var(--hexagon-large-height);
  }
  &.menu {
    width: var(--hexagon-medium-large-width);
    height: var(--hexagon-medium-large-height);
  }

  &.blank {
    width: var(--hexagon-medium-width);
    height: var(--hexagon-medium-height);
    cursor: default;

    &.small {
      width: var(--hexagon-small-blank-width);
      height: var(--hexagon-small-blank-height);
      &:after {
        width: var(--hexagon-small-blank-width);
        height: var(--hexagon-small-blank-height);
      }
      &:before {
        width: var(--hexagon-small-blank-width);
        height: var(--hexagon-small-blank-height);
      }
    }
  }

  &.outer-border {
    width: var(--border-hexagon-large-width);
    height: var(--border-hexagon-large-height);
    &.menu {
      width: var(--border-hexagon-small-width);
      height: var(--border-hexagon-small-height);
    }
  }

  &.no-hover {
    cursor: default;
  }
`;

export const Hexagon = styled.div`
  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);

  width: 100%;
  height: 100%;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-left: 1px solid var(--hexagon-border-color);
  border-right: 1px solid var(--hexagon-border-color);

  background: ${(props) => props.theme.accentBg};

  &.transparent-background {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  }
  &.success-color {
    background: ${(props) => props.theme.success};
    &.transparent-background {
      background: ${(props) => props.theme.success && rgba(props.theme.success, 0.6)};
    }
  }
  &.danger-color {
    background: ${(props) => props.theme.danger};
    &.transparent-background {
      background: ${(props) => props.theme.danger && rgba(props.theme.danger, 0.4)};
    }
  }

  &:after {
    content: '';
    width: var(--hexagon-width);
    height: var(--hexagon-height);
    position: absolute;
    transform: skewY(-30deg);
    border-top: 1px solid var(--hexagon-border-color);
    border-bottom: 1px solid var(--hexagon-border-color);
  }
  &:before {
    content: '';
    width: var(--hexagon-width);
    height: var(--hexagon-height);
    position: absolute;
    transform: skewY(30deg);
    border-top: 1px solid var(--hexagon-border-color);
    border-bottom: 1px solid var(--hexagon-border-color);
  }

  &.borderless:not(.outer-border) {
    border-left: none;
    border-right: none;
    &:after {
      content: none;
    }
    &:before {
      content: none;
    }
  }

  &:not(.no-hover):not(.blank) {
    &:hover {
      &:not(.outer-border) {
        background: ${(props) => props.theme.accentBg};
        &.success-color {
          background: ${(props) => props.theme.success};
        }
        &.danger-color {
          background: ${(props) => props.theme.danger};
        }
      }

      border-color: var(--hexagon-accent-color);
      &:after {
        border-color: var(--hexagon-accent-color);
      }
      &:before {
        border-color: var(--hexagon-accent-color);
      }

      &.outer-border {
        & div.hexagon {
          border-color: var(--hexagon-accent-color);
          &:after {
            border-color: var(--hexagon-accent-color);
          }
          &:before {
            border-color: var(--hexagon-accent-color);
          }
        }
      }
    }
  }

  &.active.icon-hexagon:not(.outer-border) {
    background: ${(props) =>
      `linear-gradient(151.04deg, ${props.theme.accentText} 17.94%, ${props.theme.accentBg} 74.56%)`};
  }

  &.small {
    &:not(.borderless) {
      &:after {
        width: var(--hexagon-small-width);
        height: var(--hexagon-small-height);
      }
      &:before {
        width: var(--hexagon-small-width);
        height: var(--hexagon-small-height);
      }
    }
  }
  &.medium {
    &:after {
      width: var(--hexagon-medium-width);
      height: var(--hexagon-medium-height);
    }
    &:before {
      width: var(--hexagon-medium-width);
      height: var(--hexagon-medium-height);
    }
  }
  &.large {
    &:after {
      width: var(--hexagon-large-width);
      height: var(--hexagon-large-height);
    }
    &:before {
      width: var(--hexagon-large-width);
      height: var(--hexagon-large-height);
    }
  }
  &.menu {
    // width: var(--hexagon-medium-large-width);
    // height: var(--hexagon-medium-large-height);
    &:after {
      width: var(--hexagon-medium-large-width);
      height: var(--hexagon-medium-large-height);
    }
    &:before {
      width: var(--hexagon-medium-large-width);
      height: var(--hexagon-medium-large-height);
    }
  }

  &.blank {
    opacity: 0.2;
    background-color: var(--hexagon-accent-color);

    &:after {
      width: var(--hexagon-medium-width);
      height: var(--hexagon-medium-height);
    }
    &:before {
      width: var(--hexagon-medium-width);
      height: var(--hexagon-medium-height);
    }

    &.small {
      width: var(--hexagon-small-blank-width);
      height: var(--hexagon-small-blank-height);
      &:after {
        width: var(--hexagon-small-blank-width);
        height: var(--hexagon-small-blank-height);
      }
      &:before {
        width: var(--hexagon-small-blank-width);
        height: var(--hexagon-small-blank-height);
      }
    }
  }

  &.outer-border {
    background: transparent;
    &:after {
      width: var(--border-hexagon-large-width);
      height: var(--border-hexagon-large-height);
    }
    &:before {
      width: var(--border-hexagon-large-width);
      height: var(--border-hexagon-large-height);
    }
    &.menu {
      &:after {
        width: var(--border-hexagon-small-width);
        height: var(--border-hexagon-small-height);
      }
      &:before {
        width: var(--border-hexagon-small-width);
        height: var(--border-hexagon-small-height);
      }
    }
  }
`;

export const Sparkle = styled.img`
  position: absolute;
  top: -9.5px;
  left: 1px;
  width: 32px;
  height: 50px;
  pointer-events: none;
  z-index: 200;

  &.menu {
    top: -12.5px;
    left: -1px;
  }
`;

export const IndicatorVoice = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 4px;
  z-index: 10;
`;
