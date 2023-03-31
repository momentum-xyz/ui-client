import styled from 'styled-components';

export const Container = styled.div``;
export const Separator = styled.div`
  border-top: 2px solid #9eeeff;
  margin: 10px 0;
`;

export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AvatarImageUpload = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background: rgba(0, 67, 115, 0.4);
  border: 0.6px solid #9eeeff;
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

export const AvatarImageInner = styled.div`
  position: absolute;
  left: -4px;
  right: -4px;

  display: flex;
  align-items: center;
  justify-content: center;

  & > .icon-container {
    position: absolute;
  }
`;

export const ReadyText = styled.div`
  margin: 26px 0 16px;
  color: white;
`;
