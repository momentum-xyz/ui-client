import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
`;

export const Hexagon = styled.div`
  --hexagon-large-width: 48px;
  --hexagon-large-height: 56px;

  --hexagon-width: 42px;
  --hexagon-height: 49px;

  --hexagon-small-width: 30px;
  --hexagon-small-height: 35px;

  --hexagon-blank-width: 36px;
  --hexagon-blank-height: 42px;

  --border-hexagon-large-width: 60px;
  --border-hexagon-large-height: 70px;

  --border-hexagon-width: 54px;
  --border-hexagon-height: 63px;

  --border-hexagon-small-width: 42px;
  --border-hexagon-small-height: 47px;

  --hexagon-border-color: var(--white);
  --hexagon-accent-color: ${(props) => props.theme.accentBg};

  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  width: var(--hexagon-width);
  height: var(--hexagon-height);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-left: 1px solid var(--hexagon-border-color);
  border-right: 1px solid var(--hexagon-border-color);

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
  &.large {
    width: var(--hexagon-large-width);
    height: var(--hexagon-large-height);
    &:after {
      width: var(--hexagon-large-width);
      height: var(--hexagon-large-height);
    }
    &:before {
      width: var(--hexagon-large-width);
      height: var(--hexagon-large-height);
    }
  }

  &.blank {
    opacity: 0.2;
    background-color: var(--hexagon-accent-color);
    width: var(--hexagon-blank-width);
    height: var(--hexagon-blank-height);

    &:after {
      width: var(--hexagon-blank-width);
      height: var(--hexagon-blank-height);
    }
    &:before {
      width: var(--hexagon-blank-width);
      height: var(--hexagon-blank-height);
    }
  }

  &.outer-border {
    width: var(--border-hexagon-large-width);
    height: var(--border-hexagon-large-height);
    &:after {
      width: var(--border-hexagon-large-width);
      height: var(--border-hexagon-large-height);
    }
    &:before {
      width: var(--border-hexagon-large-width);
      height: var(--border-hexagon-large-height);
    }
  }
`;

export const Sparkle = styled.svg`
  position: absolute;
  z-index: 10;
  top: -44%;
  left: -3%;
  width: 62.1%;
`;
