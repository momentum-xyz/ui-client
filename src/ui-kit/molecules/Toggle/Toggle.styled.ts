import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  border: var(--white) 1.25px solid;
  border-radius: 10px;
  align-items: center;
  justify-content: center;

  &.normal {
    width: 32px;
    height: 20px;
  }

  &.small {
    width: 20px;
    height: 12.5px;
  }
`;

export const Background = styled.div`
  display: flex;
  background: var(--white-30);
  border-radius: 10px;

  &.on {
    justify-content: end;
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
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
  background: var(--white);

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
