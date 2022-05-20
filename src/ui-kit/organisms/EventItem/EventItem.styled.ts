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
    min-width: 150px;
  }

  :not(.base) {
    gap: 10px;
  }
`;

export const ImageContainer = styled.div`
  width: 220px;
  height: 220px;
  flex-shrink: 0;
  padding: 5px;

  img {
    border-radius: 5px;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

export const Actions = styled.div`
  display: flex;
  position: absolute;
  top: 15px;
  right: 15px;
  gap: 10px;
`;

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px 5px;
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

export const TextRow = styled.div`
  max-width: 50%;
  margin-bottom: 10px;
`;

export const Header = styled.div`
  display: block-inline;
  gap: 3px;
`;
export const SpaceHeader = styled.div``;
export const WorldHeader = styled.div``;
export const BoldHeader = styled.span`
  color: ${(props) => props.theme.accent};
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  font-weight: bold;
  text-align: left;
  &.notBold {
    font-weight: normal;
  }
`;

export const NormalHeader = styled.span`
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  font-weight: normal;
  text-align: left;
`;

export const DateRow = styled.div`
  margin: 10px 0;
  display: flex;
  gap: 5px;
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
  width: 100%;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 10px;

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
