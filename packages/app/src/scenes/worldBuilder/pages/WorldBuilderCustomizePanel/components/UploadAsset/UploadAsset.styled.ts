import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 500px;
  min-width: 500px;
`;

export const TitleHolder = styled.div`
  padding: 20px;
  width: 100%;
`;

export const ActionButtonHolder = styled.div`
  // position: absolute;
  // bottom: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AssetUploadContainer = styled.div`
  position: relative;
  padding: 20px 10px;
  margin: 20px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  // background: var(--uploader-bg);
  background: transparent;
  backdrop-filter: blur(10px);
  // width: 250px;
  width: 100%;
  height: 100%;
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

export const UploadProgress = styled.div`
  margin-top: 30px;
  width: 100%;
`;
