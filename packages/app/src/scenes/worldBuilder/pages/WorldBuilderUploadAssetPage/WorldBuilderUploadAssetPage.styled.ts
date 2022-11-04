import styled from 'styled-components';

export const Container = styled.div``;

export const AssetUploadContainer = styled.div`
  position: relative;
  padding: 20px 10px;
  margin: 20px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background: var(--uploader-bg);
  backdrop-filter: blur(10px);
  width: 250px;

  &.error {
    border: 1px solid ${(props) => props.theme.accentDanger};
  }
`;

export const FilePreview = styled.div`
  padding: 10px;
`;

export const UploadingError = styled.div`
  margin-bottom: 10px;
`;
