import styled from 'styled-components';

import {Text} from 'ui-kit';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const ImageWrapper = styled.img`
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

export const VideoWrapper = styled.div`
  padding: 0;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;

  > iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const TextItem = styled(Text)`
  padding-top: 5px;
`;
