import {rgba} from 'polished';
import {memo} from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  // --scroll-offset: 455px;

  // padding: 10px;
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

export const Wrapper = styled.div``;

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
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
  gap: 15px;
  font-weight: 500;
  font-size: 13px;
  line-height: 21px;
  letter-spacing: 0.08em;
  position: absolute;
  top: 110px;
  width: 100%;
  left: 0;
`;

export const PreviewImageHolder = memo(styled.div<{
  file?: File;
  initialImageSrc?: string | null;
}>`
  background-position: center center;
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-image: url(${({file, initialImageSrc}) =>
    (file && URL.createObjectURL(file)) || (file === null ? file : initialImageSrc)});
`);

export const ActionBar = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  gap: 40px;

  & > button {
    flex: 1;
    justify-content: center;
    max-width: 156px;
  }
`;

export const Error = styled.div`
  color: ${(props) => props.theme.danger};
  font-size: 12px;
  margin: 10px 0 0 0;
`;

export const RemoveIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 1;
`;
