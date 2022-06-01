import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImagePreview = styled.img`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  object-fit: cover;
`;

export const AvatarImageUpload = styled.div`
  position: relative;
  margin: 0 0 32px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  background: var(--black-100);
  position: relative;
`;

export const FieldName = styled.div`
  display: grid;
  padding: 4px 0 0 14px;
  grid-template-columns: 16px auto;
  grid-gap: 12px;
`;

export const Field = styled.div`
  display: grid;
  margin: 0 0 20px 0;
  grid-template-columns: 1fr 300px;
`;

export const Divider = styled.div`
  margin: 22px 0 26px 0;
  background-color: ${(props) => props.theme.accent};
  height: 1px;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 200px;
`;
