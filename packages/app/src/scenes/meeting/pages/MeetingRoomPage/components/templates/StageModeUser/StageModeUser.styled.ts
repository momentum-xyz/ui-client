import styled from 'styled-components';
import {rgba} from 'polished';

export const UserListItem = styled.li`
  position: relative;
  margin: 0 0 22px 0;
  padding: 5px;
  width: var(--meeting-size);
  height: var(--meeting-size);
  border-radius: 50%;
  border: 1px solid transparent;

  .invite {
    display: none;
  }

  &:hover {
    cursor: pointer;

    .invite {
      display: flex;
    }
  }
`;

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: ${(props) => props.theme.bg};

  svg {
    width: 32px;
    color: ${(props) => props.theme.accent};
  }
`;

export const InviteOnStage = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 50%;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  overflow: hidden;
  top: 0;
  z-index: 2;
`;

export const MicrophoneOff = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 4px;
  right: 0;
  left: 0;
  z-index: 1;
`;

export const Username = styled.div`
  position: absolute;
  display: flex;
  width: var(--meeting-size);
  justify-content: center;
  bottom: -18px;
  right: 0;
  left: 0;
`;
