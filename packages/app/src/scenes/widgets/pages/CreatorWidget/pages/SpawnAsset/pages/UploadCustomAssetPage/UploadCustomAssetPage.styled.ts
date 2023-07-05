import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  padding: 10px 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export const FileUploaderContainer = styled.div`
  position: relative;
  height: 50px;
  width: 100%;
`;

export const Error = styled.p`
  text-align: center;
  color: red;
`;

export const PreviewContainer = styled.div`
  width: 300px;
  height: 300px;

  border-radius: 10px;
`;

export const FormContainer = styled.div``;

export const InputsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

export const Radio = styled.div`
  padding: 8px 10px;
  width: 100%;
  border-radius: 4px;
  background: ${(props) => rgba(props.theme.accentBg, 0.2)};
`;

export const ControlsRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

  button {
    min-width: 160px;
    justify-content: center;
  }
`;

export const UploadContainer = styled.div`
  position: relative;
  margin: 20px 0px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  width: 100%;
  height: 240px;
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

export const AssetInformation = styled.div`
  margin-bottom: 20px;
  font-size: var(--font-size-s);

  & > h4 {
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 10px;
    letter-spacing: 0.08em;
    text-align: center;
    line-height: 21px;
  }
  & > div {
    line-height: 22px;
    letter-spacing: 0.02em;
    text-align: center;
  }
`;

export const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: ${(props) => rgba(props.theme.accentBg, 0.2)};
  background-size: cover;
  border-radius: inherit;
  height: 100%;
  z-index: 10;
`;
