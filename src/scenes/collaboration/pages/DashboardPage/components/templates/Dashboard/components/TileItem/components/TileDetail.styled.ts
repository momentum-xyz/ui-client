import styled from 'styled-components';

import {TileMenu} from 'ui-kit';

export const MenuWrapper = styled.div`
  opacity: 0;
`;

export const PositionedTileMenu = styled(TileMenu)`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0 6px 6px 0;
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

export const TextTile = styled.div`
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  text-align: left;
  white-space: pre-line;

  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;

  padding-top: 5px;

  :after {
    content: '';
    display: inline-block;
    width: 55px; /* the value of padding */
  }
`;
