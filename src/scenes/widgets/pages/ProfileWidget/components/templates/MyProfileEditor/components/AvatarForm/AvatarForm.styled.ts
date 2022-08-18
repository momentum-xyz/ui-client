import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
`;

export const FileUploaderItem = styled.div`
  flex: 50%;
  padding: 15px 0 10px;
  width: 300px;
  height: 100%;
`;

export const ImagePreview = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 5px;
  object-fit: cover;
`;

export const AvatarImageUpload = styled.div`
  display: flex;
  padding: 20px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: var(--uploader-bg);
  backdrop-filter: blur(10px);
  gap: 10px;

  &.error {
    border: 1px solid ${(props) => props.theme.accentDanger};
  }
  .Button-custom {
    width: 110px;
    padding: 0;
  }
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
