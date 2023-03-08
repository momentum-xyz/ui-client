import styled from 'styled-components';

const hexagonSizeVariables = {
  'hexagon-large-width': '48px',
  'hexagon-large-height': '56px',

  'hexagon-width': '42px',
  'hexagon-height': '49px',

  'hexagon-small-width': '30px',
  'hexagon-small-height': '35px',

  'hexagon-blank-width': '36px',
  'hexagon-blank-height': '42px',

  'border-hexagon-large-width': '60px',
  'border-hexagon-large-height': '70px'
};

export const Wrapper = styled.div`
  position: relative;

  width: ${hexagonSizeVariables['hexagon-width']};
  height: ${hexagonSizeVariables['hexagon-height']};

  &.small {
    width: ${hexagonSizeVariables['hexagon-small-width']};
    height: ${hexagonSizeVariables['hexagon-small-height']};
    &:not(.borderless) {
      &:after {
        width: ${hexagonSizeVariables['hexagon-small-width']};
        height: ${hexagonSizeVariables['hexagon-small-height']};
      }
      &:before {
        width: ${hexagonSizeVariables['hexagon-small-width']};
        height: ${hexagonSizeVariables['hexagon-small-height']};
      }
    }
  }
  &.large {
    width: ${hexagonSizeVariables['hexagon-large-width']};
    height: ${hexagonSizeVariables['hexagon-large-height']};
  }

  &.blank {
    width: ${hexagonSizeVariables['hexagon-blank-width']};
    height: ${hexagonSizeVariables['hexagon-blank-height']};
  }

  &.outer-border {
    width: ${hexagonSizeVariables['border-hexagon-large-width']};
    height: ${hexagonSizeVariables['border-hexagon-large-height']};
  }
`;

export const Hexagon = styled.div`
  --hexagon-border-color: ${(props) => props.theme.text};
  --hexagon-accent-color: ${(props) => props.theme.accentBg};

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

  &:after {
    content: '';
    width: ${hexagonSizeVariables['hexagon-width']};
    height: ${hexagonSizeVariables['hexagon-height']};
    position: absolute;
    transform: skewY(-30deg);
    border-top: 1px solid var(--hexagon-border-color);
    border-bottom: 1px solid var(--hexagon-border-color);
  }
  &:before {
    content: '';
    width: ${hexagonSizeVariables['hexagon-width']};
    height: ${hexagonSizeVariables['hexagon-height']};
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
    &:not(.borderless) {
      &:after {
        width: ${hexagonSizeVariables['hexagon-small-width']};
        height: ${hexagonSizeVariables['hexagon-small-height']};
      }
      &:before {
        width: ${hexagonSizeVariables['hexagon-small-width']};
        height: ${hexagonSizeVariables['hexagon-small-height']};
      }
    }
  }
  &.large {
    &:after {
      width: ${hexagonSizeVariables['hexagon-large-width']};
      height: ${hexagonSizeVariables['hexagon-large-height']};
    }
    &:before {
      width: ${hexagonSizeVariables['hexagon-large-width']};
      height: ${hexagonSizeVariables['hexagon-large-height']};
    }
  }

  &.blank {
    opacity: 0.2;
    background-color: var(--hexagon-accent-color);

    &:after {
      width: ${hexagonSizeVariables['hexagon-blank-width']};
      height: ${hexagonSizeVariables['hexagon-blank-height']};
    }
    &:before {
      width: ${hexagonSizeVariables['hexagon-blank-width']};
      height: ${hexagonSizeVariables['hexagon-blank-height']};
    }
  }

  &.outer-border {
    &:after {
      width: ${hexagonSizeVariables['border-hexagon-large-width']};
      height: ${hexagonSizeVariables['border-hexagon-large-height']};
    }
    &:before {
      width: ${hexagonSizeVariables['border-hexagon-large-width']};
      height: ${hexagonSizeVariables['border-hexagon-large-height']};
    }
  }
`;

export const Sparkle = styled.svg`
  position: absolute;
  z-index: 10;
  top: -25%;
  left: 0;
  width: 62.1%;
`;
