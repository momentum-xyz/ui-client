import styled from 'styled-components';

export const Container = styled.div`
  width: 350px;
  height: 295px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ImageUploadContainer = styled.div`
  position: relative;
  margin: 20px 0px;
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
  & > .text {
    margin-bottom: 1em;
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
  border-radius: 100%;
`;
