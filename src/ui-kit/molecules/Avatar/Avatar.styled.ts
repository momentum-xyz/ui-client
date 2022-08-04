import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  border-radius: 100%;
  background: var(--black-100);
  color: var(--prime-blue-100);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;

  &.showBorder {
    border: 1px solid var(--white);

    &.showHover {
      &:hover {
        border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1.0)};
      }
    }
  }

  &.super-small {
    width: 17.28px;
    height: 17.28px;
  }

  &.extra-small {
    width: 20.37px;
    height: 20.37px;
  }

  &.small {
    width: 26.4px;
    height: 26.4px;
  }

  &.normal {
    width: 60px;
    height: 60px;
  }

  &.large {
    width: 78.22px;
    height: 78.22px;
  }

  &.extra-large {
    width: 200px;
    height: 200px;
  }

  .avatar {
    width: 50%;
    height: 50%;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const IndicatorWrapper = styled.div`
  position: absolute;
  border-radius: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &.large {
    width: 20px;
    height: 20px;
    right: 6.96%;
    bottom: 2.84%;
  }

  &.normal {
    width: 15px;
    height: 15px;
    right: 6.96%;
    bottom: 2.84%;
  }

  &.small {
    width: 11px;
    height: 11px;
    right: 0;
    bottom: 0;
  }

  &.extra-small {
    width: 9px;
    height: 9px;
    right: -2px;
    bottom: -2px;
  }
`;

export const ImageWrapper = styled.div`
  border-radius: 100%;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

export const Indicator = styled.div`
  border-radius: 100%;

  &.large {
    width: 15px;
    height: 15px;
  }

  &.normal {
    width: 11px;
    height: 11px;
  }

  &.small {
    width: 8px;
    height: 8px;
  }

  &.extra-small {
    width: 6px;
    height: 6px;
  }

  &.online {
    background: var(--online);
  }

  &.dnd {
    background: var(--dnd);
  }
`;
