import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 455px;

  padding: 10px;
`;

export const InfoContainer = styled.div`
  padding: 0 0 20px 0;
  margin: 0 0 20px 0;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};

  & > div {
    font-weight: 600;
    font-size: var(--font-size-l);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin: 0 0 12px;
  }

  & > span {
    letter-spacing: 0.02em;
    line-height: 22px;
  }
`;

export const Wrapper = styled.div`
  & > div {
    padding: 20px;
  }
`;

export const InputContainer = styled.div`
  border-top: 1px solid ${(props) => props.theme.accentText};
  margin-top: 20px;
  padding: 20px 0 20px !important;
`;

export const ImageUploadContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  padding-top: 0px;
  margin: -20px;

  padding: 45px;
  border: 1px dashed ${(props) => props.theme.text};
  border-radius: 8px;

  height: 280px;

  &.has-image {
    align-items: center;
    margin: 0px;

    width: 100%;
    height: 280px;

    border-style: solid;
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

export const Uploader = styled.div`
  button {
    margin: 100px 0 0 0;
    min-width: 210px;
  }
`;

export const DragAndDropPrompt = styled.div`
  margin: -40px 0 0 0;
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  gap: 30px;
  font-weight: 500;
  font-size: 13px;
  line-height: 21px;
  letter-spacing: 0.08em;
  font-family: 'Poppins';
  position: absolute;
  top: 110px;
  width: 100%;
  left: 0;
`;

export const PreviewImageHolder = styled.div`
  background-position: center center;
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
