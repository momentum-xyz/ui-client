import styled from 'styled-components';

import {Text} from 'ui-kit';

export const MenuWrapper = styled.div`
  .menu-position {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0 8px 10px 0;
  }
  opacity: 0;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;

  :hover {
    ${MenuWrapper} {
      opacity: 1;
    }
  }
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
  :after {
    content: '';
    display: inline-block;
    padding-right: 18px;
  }
`;
