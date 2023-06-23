import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px 0 20px 0;
  margin: 0 auto;
  display: flex;
  width: 390px;
  flex-direction: column;
  justify-content: space-between;
`;

export const FormContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 20px;
`;

export const InputsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

export const ControlsRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const ImageUploadContainer = styled.div`
  position: relative;
  margin: 20px 0px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  width: 390px;
  height: 390px;
  padding-top: 0px;
  margin-top: 0px;

  padding: 45px;
  border: 1px dashed ${(props) => props.theme.text};
  border-radius: 8px;
  margin-bottom: 20px;

  &.has-image {
    align-items: center;
  }

  &.error {
    border: 1px dashed ${(props) => props.theme.danger};
  }

  & button {
    color: ${(props) => props.theme.text};
    letter-spacing: 0.08em;
    font-size: 14px !important;
    padding: 20px !important;
    width: 100%;
  }
`;

export const SkyboxInformation = styled.div`
  margin-bottom: 20px;
  & > h1 {
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: 10px;
    letter-spacing: 0.08em;
    line-height: 21px;
  }
  & > span {
    line-height: 22px;
    letter-spacing: 0.02em;
  }
`;

export const PreviewImageHolder = styled.div`
  height: 360px;
  width: 360px;
  background-position: center center;
  background-size: cover;
  position: absolute;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
`;
