import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  --width: 355px;
  --height: 200px;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & .image-upload-button {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border: 0.6px solid ${(props) => props.theme.accentText};
    width: var(--width);
    height: var(--height);
  }

  & .icon-container {
    position: absolute;
  }
`;

export const ImagePreview = styled.img`
  position: absolute;
  width: var(--width);
  height: var(--height);
  object-fit: cover;
`;
