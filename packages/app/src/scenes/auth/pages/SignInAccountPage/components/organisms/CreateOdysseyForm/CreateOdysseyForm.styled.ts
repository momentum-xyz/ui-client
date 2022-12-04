import styled from 'styled-components';

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ImageContainer = styled.div`
  padding: 0 2px;
  display: flex;
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
  background: var(--black-100);
  position: relative;
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
`;
