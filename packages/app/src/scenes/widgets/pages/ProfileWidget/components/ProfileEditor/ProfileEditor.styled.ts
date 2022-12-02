import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 12px 10px 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 12px;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Avatar = styled.div`
  padding: 0 0 0 12px;
  display: flex;
  align-items: center;
`;

export const AvatarImage = styled.img`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarImageUpload = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background: var(--black-100);
  position: relative;
`;

export const AvatarImageInner = styled.div`
  position: absolute;
  left: -11px;
  right: -11px;
`;
