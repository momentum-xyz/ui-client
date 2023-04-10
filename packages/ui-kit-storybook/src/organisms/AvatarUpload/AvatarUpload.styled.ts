import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;

  & .image-upload-button {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border: 0.6px solid ${(props) => props.theme.accentText};
    width: 360px;
    height: 200px;
  }

  & .icon-container {
    position: absolute;
  }
`;

export const ImagePreview = styled.img`
  position: absolute;
  width: 360px; // 100px;
  height: 200px; // 100px;
  object-fit: cover;
`;
