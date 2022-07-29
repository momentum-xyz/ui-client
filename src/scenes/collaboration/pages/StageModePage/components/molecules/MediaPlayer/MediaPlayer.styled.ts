import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;

  &.showRing {
    border: 2px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
  }

  :not(&.showRing) {
    border: transparent;
  }
`;

export const VideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

export const AvatarContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.bg && rgba(props.theme.bg, 1)};
  color: ${(props) => props.theme.accent && rgba(props.theme.text, 1)};
  pointer-events: none;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InfoContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

export const Info = styled.div`
  background: var(--black-40);
  padding: 5px;
  border-radius: 10px;
  gap: 10px;
  display: flex;
`;
