import styled from 'styled-components';

export const Container = styled.div`
  width: 350px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ImageUploadContainer = styled.div`
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
  width: 100%;
  min-height: 250px;

  &.error {
    border: 1px solid ${(props) => props.theme.accentDanger};
  }
`;

export const PreviewImageHolder = styled.div`
  height: 150px;
  width: 150px;
  margin: 10px;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
`;
