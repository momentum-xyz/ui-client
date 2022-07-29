import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  border: var(--white) 1.25px solid;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.normal {
    width: 32px;
    height: 20px;
  }

  &.small {
    width: 20px;
    height: 12.5px;
  }

  &.disabled {
    cursor: wait;
    opacity: 0.5;
  }
`;

export const Background = styled.div`
  display: flex;
  background: var(--white-30);
  border-radius: 10px;

  &.variant-availability {
    background: var(--black);
  }

  &.on {
    justify-content: end;

    &.variant-normal {
      background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
    }
  }

  &.off {
    justify-content: start;
  }

  &.normal {
    height: 12px;
    width: 24px;
  }

  &.small {
    height: 7.5px;
    width: 15px;
  }
`;

export const Toggle = styled.div`
  border-radius: 100%;

  &.variant-normal {
    background: var(--white);
  }

  &.variant-availability {
    &.on {
      background: var(--online);
    }

    &.off {
      background: var(--dnd);
    }
  }

  &.normal {
    height: 12px;
    width: 12px;
  }

  &.small {
    height: 7.5px;
    width: 7.5px;
  }
`;

export const HiddenInput = styled.input`
  display: none;
  margin-bottom: 0;
`;
