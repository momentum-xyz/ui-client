import {rgba} from 'polished';
import styled from 'styled-components';

import {HexagonSizesInterface} from './Hexagon';

export const WrapperButton = styled.button`
  &.disabled {
    cursor: not-allowed;
  }
`;

export const Wrapper = styled.div<HexagonSizesInterface>`
  --hexagon-border-color: ${(props) => props.theme.text};
  --hexagon-accent-color: ${(props) => props.theme.accentBg};

  --hexagon-large-width: ${(props) => `${props.large.w}px`};
  --hexagon-large-height: ${(props) => `${props.large.h}px`};

  --hexagon-width: ${(props) => `${props.normal.w}px`};
  --hexagon-height: ${(props) => `${props.normal.h}px`};

  --hexagon-medium-large-width: ${(props) => `${props.mediumLarge.w}px`};
  --hexagon-medium-large-height: ${(props) => `${props.mediumLarge.h}px`};

  --hexagon-medium-width: ${(props) => `${props.medium.w}px`};
  --hexagon-medium-height: ${(props) => `${props.medium.h}px`};

  --hexagon-small-width: ${(props) => `${props.small.w}px`};
  --hexagon-small-height: ${(props) => `${props.small.h}px`};

  --hexagon-small-blank-width: ${(props) => `${props.smallBlank.w}px`};
  --hexagon-small-blank-height: ${(props) => `${props.smallBlank.h}px`};

  --border-hexagon-large-width: ${(props) => `${props.borderLarge.w}px`};
  --border-hexagon-large-height: ${(props) => `${props.borderLarge.h}px`};

  --border-hexagon-small-width: ${(props) => `${props.borderSmall.w}px`};
  --border-hexagon-small-height: ${(props) => `${props.borderSmall.h}px`};

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

  &.disabled {
    pointer-events: none;
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

  &.disabled {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
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

export const IndicatorDanger = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: ${(props) => props.theme.danger};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 4px;
  z-index: 10;
`;

export const Label = styled.div`
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xs);
  font-weight: 600;
`;
