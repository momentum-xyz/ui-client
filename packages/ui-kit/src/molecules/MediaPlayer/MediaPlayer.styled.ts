import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  video {
    border-radius: 4px;
    object-fit: cover;
  }
`;

export const PlayPause = styled.div`
  position: absolute;
  left: calc(50% - 20px);
  bottom: 26px;
`;

export const TrackContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
`;
