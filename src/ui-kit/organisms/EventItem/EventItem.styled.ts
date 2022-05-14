import styled from 'styled-components';
import {rgba} from 'polished';

export const Buttons = styled.div`
  display: flex;
  &.base {
    justify-content: space-between;
    margin-right: 20px;
    width: 100%;
  }

  .Button-custom {
    max-width: 200px;
  }

  :not(.base) {
    gap: 10px;
  }
`;

export const ImageContainer = styled.div`
  width: 151px;
  height: 141px;
  flex-shrink: 0;
  padding-right: 15px;
  padding-top: 10px;

  img {
    border-radius: 5px;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

export const BaseInfo = styled.div`
  flex-shrink: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

export const Row = styled.div`
  display: flex;

  &.header {
    justify-content: space-between;
  }

  &.body {
    height: 100%;
  }

  &.more {
    align-items: center;
    gap: 10px;
  }

  ${BaseInfo} ~ .ShowMoreText-custom {
    margin-left: 20px;
  }
`;

export const Info = styled.div`
  padding: 5px;
  padding-bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  ${Row} ~ ${Buttons} {
    margin-top: 10px;
  }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  backdrop-filter: blur(10px);
  border-radius: 10px;

  @keyframes cssAnimation {
    0% {
      border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }

    100% {
      border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0)};
    }
  }

  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};

  &.highlighted {
    border: 1px solid transparent;
    animation: cssAnimation 1000ms ease-in-out;
  }

  .AddToCalendarContainer {
    border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    border-radius: 7px;
    background: ${(props) => props.theme.bg && rgba(props.theme.bg, 1)};
    position: absolute;
    right: 20px;

    .Button-custom {
      white-space: nowrap;
    }
  }
`;

export const LiveIndicator = styled.div`
  display: flex;
  gap: 5px;
  background: var(--danger-red);
  padding: 0 10px;
  border-radius: 5px;
  color: var(--white);
  font-weight: bold;
  text-transform: uppercase;
  align-items: center;
`;
