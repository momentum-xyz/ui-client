import styled from 'styled-components';

export const Item = styled.div`
  padding-top: 10px;
`;

export const TextItem = styled.div`
  padding-bottom: 10px;
`;

export const FileUploaderItem = styled.div`
  flex: 50%;
  padding-top: 15px;
`;

export const TileImageUpload = styled.div`
  display: flex;
  padding: 10px;
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

export const ImagePreview = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 5px;
  object-fit: cover;
`;
