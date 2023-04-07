import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

export const Circle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  border: 0.6px solid ${(props) => props.theme.accentText};
  position: relative;

  & .image-upload-button {
    background: transparent;
    width: 100px;
    height: 100px;
    border: none;
    border-radius: 100%;
  }
`;

export const ImagePreview = styled.img`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  object-fit: cover;
`;

export const CircleInner = styled.div`
  --side-arrow-background-color: linear-gradient(
    90deg,
    rgba(158, 238, 255, 0.16) 0%,
    rgba(0, 67, 115, 0.8) 100%
  );

  position: absolute;
  left: -4px;
  right: -4px;

  display: flex;
  align-items: center;
  justify-content: center;

  & > .icon-container {
    position: absolute;
  }

  &:before {
    content: '';
    position: absolute;
    left: -120px;
    width: 100px;
    height: 4px;

    background: var(--side-arrow-background-color);
    border-radius: 2px;
  }

  &:after {
    content: '';
    position: absolute;
    right: -120px;
    width: 100px;
    height: 4px;

    background: var(--side-arrow-background-color);
    border-radius: 2px;
  }
`;
