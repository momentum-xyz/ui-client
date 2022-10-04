import styled from 'styled-components';

export const Div = styled.div`
  .rc-tooltip {
    visibility: visible;
    font-size: var(--font-size-s);
    line-height: 16.9px;
    opacity: 0.9;
  }

  &.darkBackground {
    opacity: 1 !important;

    * {
      opacity: 1 !important;
    }
  }

  .rc-tooltip-inner {
    color: var(--white);
    text-align: center;
    background-color: var(--blue-dark);
    border-radius: 4px;
    box-shadow: 0 0 0 transparent;
    opacity: 0.9;
  }

  .rc-tooltip-placement-top .rc-tooltip-arrow,
  .rc-tooltip-placement-topLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-topRight .rc-tooltip-arrow {
    border-top-color: var(--blue-dark);
    opacity: 0.9;
  }

  .rc-tooltip-placement-right .rc-tooltip-arrow,
  .rc-tooltip-placement-rightTop .rc-tooltip-arrow,
  .rc-tooltip-placement-rightBottom .rc-tooltip-arrow {
    border-right-color: var(--blue-dark);
    opacity: 0.9;
  }

  .rc-tooltip-placement-left .rc-tooltip-arrow,
  .rc-tooltip-placement-leftTop .rc-tooltip-arrow,
  .rc-tooltip-placement-leftBottom .rc-tooltip-arrow {
    border-left-color: var(--blue-dark);
    opacity: 0.9;
  }

  .rc-tooltip-placement-bottom .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomLeft .rc-tooltip-arrow,
  .rc-tooltip-placement-bottomRight .rc-tooltip-arrow {
    border-bottom-color: var(--blue-dark);
    opacity: 0.9;
  }
`;
