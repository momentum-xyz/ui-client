import styled from 'styled-components';

export const UserListItem = styled.li`
  position: relative;
  margin: 0 0 14px 0;
  padding: 5px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  border: 1px solid transparent;

  &.colored {
    border: 1px solid ${(props) => props.theme.accent};
  }
`;

export const Inner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid transparent;

  &.colored {
    border: 2px solid ${(props) => props.theme.accent};
  }
`;

export const Video = styled.div`
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
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
`;

export const MicrophoneOff = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 12px;
  right: 0;
  left: 0;
`;

export const Username = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: -18px;
  right: 0;
  left: 0;
`;
