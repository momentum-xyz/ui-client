import YouTube from 'react-youtube';
import styled from 'styled-components';

// @ts-ignore Youtube type isn't compatible with styled-components, but works
export const Video = styled(YouTube)`
  width: 100%;

  iframe {
    width: 100%;
    height: 264px;
  }
`;
