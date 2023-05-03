import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div``;

export const InfoContainer = styled.div`
  padding-bottom: 30px;
  margin-bottom: 50px;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};

  & > h1 {
    font-weight: 600;
    font-size: 15px;
    line-height: 22px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin: 0 0 12px;
  }
  & > span {
    letter-spacing: 0.02em;
    line-height: 22px;
  }
`;
export const UploadContainer = styled.div`
  & > div {
    padding: 20px;
  }
`;

export const ImageUploadContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  width: 490px;
  height: 490px;
  padding-top: 0px;
  margin: 0px;

  padding: 45px;
  border: 1px dashed ${(props) => props.theme.text};
  border-radius: 8px;

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

export const PreviewImageHolder = styled.div`
  background-position: center center;
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
