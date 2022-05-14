import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  border: var(--white) 1.25px solid;
  border-radius: 10px;
  width: 32px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

export const Background = styled.div`
  display: flex;
  height: 12px;
  width: 24px;
  background: var(--white-30);
  border-radius: 10px;

  &.on {
    justify-content: end;
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
  }

  &.off {
    justify-content: start;
  }
`;

export const Toggle = styled.div`
  border-radius: 100%;
  height: 12px;
  width: 12px;
  background: var(--white);
`;

export const HiddenInput = styled.input`
  display: none;
  margin-bottom: 0;
`;
