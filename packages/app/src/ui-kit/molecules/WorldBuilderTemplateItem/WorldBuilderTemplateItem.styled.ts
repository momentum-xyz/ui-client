import styled from 'styled-components';
import {Text} from '@momentum/ui-kit';

export const Container = styled.div`
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 1px solid transparent;

  &:not(&.selected) {
    width: 100%;
    aspect-ratio: 1;

    :hover {
      border: 1px solid ${(props) => props.theme.accent};
    }
  }

  &.selected {
    display: flex;
    width: 100%;
  }
`;

export const Image = styled.img`
  object-fit: cover;

  &:not(&.selected) {
    height: 100%;
    width: 100%;
  }

  &.selected {
    width: 70%;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background: ${(props) => props.theme.bg};
  position: absolute;
  bottom: 0;
  width: 100%;

  &.selected {
    position: unset;
    gap: 20px;
    width: 30%;
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Description = styled(Text)`
  overflow: hidden;

  &:not(&.selected) {
    max-width: 250px;
  }
`;
