import styled from 'styled-components';

export const DialogContainer = styled.div`
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
`;

export const ImageUploadContainer = styled.div`
  position: relative;
  height: 50px;
  width: 250px;
`;

export const PreviewImageHolder = styled.div`
  height: 64px;
  width: 64px;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
`;
