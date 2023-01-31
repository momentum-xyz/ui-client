import styled from 'styled-components';

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
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

export const Numbers = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
