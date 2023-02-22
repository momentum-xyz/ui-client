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

  --border-hexagon-large-width: 60px;
  --border-hexagon-large-height: 70px;

  --border-hexagon-width: 54px;
  --border-hexagon-height: 63px;

  --border-hexagon-small-width: 42px;
  --border-hexagon-small-height: 47px;

  --hexagon-border-color: var(--white);
  --hexagon-border-blue-color: var(--blue-light);

  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  width: var(--hexagon-width);
  height: var(--hexagon-height);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  border-left: 1px solid var(--hexagon-border-color);
  border-right: 1px solid var(--hexagon-border-color);

  overflow: hidden;

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

  &.blank {
    opacity: 0.2;
  }

  &.blue-border {
    border-color: var(--hexagon-border-blue-color);
    &:after {
      border-color: var(--hexagon-border-blue-color);
    }
    &:before {
      border-color: var(--hexagon-border-blue-color);
    }
  }

  &.small {
    width: var(--hexagon-small-width);
    height: var(--hexagon-small-height);
    &:after {
      width: var(--hexagon-small-width);
      height: var(--hexagon-small-height);
    }
    &:before {
      width: var(--hexagon-small-width);
      height: var(--hexagon-small-height);
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
  &.border {
    width: var(--border-hexagon-width);
    height: var(--border-hexagon-height);
    &:after {
      width: var(--border-hexagon-width);
      height: var(--border-hexagon-height);
    }
    &:before {
      width: var(--border-hexagon-width);
      height: var(--border-hexagon-height);
    }
    &.small {
      width: var(--border-hexagon-small-width);
      height: var(--border-hexagon-small-height);
      &:after {
        width: var(--border-hexagon-small-width);
        height: var(--border-hexagon-small-height);
      }
      &:before {
        width: var(--border-hexagon-small-width);
        height: var(--border-hexagon-small-height);
      }
    }
    &.large {
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
  }
`;
