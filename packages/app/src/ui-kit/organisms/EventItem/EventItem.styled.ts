import styled from 'styled-components';
import {rgba} from 'polished';

import {Button, Text} from 'ui-kit/atoms';
import {Avatar} from 'ui-kit/molecules';

export const Buttons = styled.div`
  display: flex;

  &.base {
    justify-content: space-between;
    margin-right: 20px;
    width: 100%;
  }

  :not(.base) {
    gap: 10px;
  }
`;

export const EventButton = styled(Button)`
  max-width: 200px;
  min-width: 150px;
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

export const DateRow = styled.div`
  margin: 10px 0;
  display: flex;
  gap: 5px;
  flex-shrink: 0;
  width: max-content;
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

  .add-calendar-button {
    white-space: nowrap;
  }

  .AddToCalendarContainer {
    position: relative;
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

export const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

export const AttendeesContainer = styled.div`
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 5px;
  grid-template-columns: 100px 100px 100px 100px;
  grid-template-rows: 70px 70px;
  grid-auto-flow: dense;
  transform: rotateY(180deg);
  margin: 30px 0;
`;

export const AttendeeAvatar = styled(Avatar)`
  width: 40px !important;
  height: 40px !important;
`;

export const AttendeeNameText = styled(Text)`
  width: inherit;
`;

export const AttendeeContrainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  overflow: hidden;
  gap: 10px;
  transform: rotateY(180deg);
`;
