import styled from 'styled-components';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Video = styled.video`
  object-fit: cover;
  border-radius: 100%;
  border: 2px dashed ${(props) => props.theme.accent};
  overflow: hidden;
  width: 200px;
  height: 200px;

  &.paused {
    background: var(--black-100);
  }
`;

export const AudioVideoSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AudioVideoSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AudioVideoButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
`;
