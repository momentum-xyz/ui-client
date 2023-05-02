import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  --width: 360px;
  --height: 200px;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  border: 0.6px solid ${(props) => props.theme.accentText};
  border-radius: 4px;
  width: var(--width);
  height: var(--height);

  & .image-upload-button {
    border: none;
    width: var(--width);
    height: var(--height);
  }

  & .icon-container {
    position: absolute;
  }
`;

export const FileUploaderContainer = styled.div`
  z-index: 2;
`;

export const ImagePreview = styled.img`
  position: absolute;
  width: var(--width);
  height: var(--height);
  object-fit: cover;
  z-index: 0;
`;
