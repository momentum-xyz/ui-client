import styled from 'styled-components';
import {rgba} from 'polished';

export const ImageContainer = styled.div`
  width: 200px;
  height: 190px;
  flex-shrink: 0;
  padding: 5px 25px 5px 5px;

  img {
    border-radius: 5px;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const Row = styled.div`
  display: flex;

  &.body {
    height: 100%;
  }

  &.more {
    align-items: center;
    gap: 10px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

export const Container = styled.div`
  display: flex;
  position: relative;

  width: 100%;
  border-radius: 10px;
  padding: 10px;

  @keyframes cssAnimation {
    0% {
      border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 1)};
    }

    100% {
      border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0)};
    }
  }

  background: rgba(1, 255, 179, 0.1);

  &.highlighted {
    border: 1px solid transparent;
    animation: cssAnimation 1000ms ease-in-out;
  }

  .add-calendar-button {
    white-space: nowrap;
  }

  .AddToCalendarContainer {
    position: relative;
  }
`;
