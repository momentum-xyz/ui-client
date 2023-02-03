import styled from 'styled-components';

export const Container = styled.div`
  width: 350px;
  height: 305px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ImageUploadContainer = styled.div`
  position: relative;
  margin: 20px 0px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  width: 100%;
  padding-top: 0px;
  margin-top: 0px;

  &.has-image {
    align-items: center;
  }

  &.error {
    border: 1px solid ${(props) => props.theme.accentDanger};
  }
`;

export const SkyboxInformation = styled.div`
  margin-bottom: 10px;
  & > .text {
    margin-bottom: 20px;
  }
`;

export const PreviewImageHolder = styled.div`
  min-height: 180px;
  width: 180px;
  margin-bottom: 20px;
  border-radius: 100%;
  background-position: center center;
  background-size: cover;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 100%;
`;
