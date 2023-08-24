import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.div`
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 3.2px;
  font-style: normal;
  font-weight: 700;
`;

export const Description = styled.div`
  padding: 10px 0 0 0;
  letter-spacing: 0.28px;
  line-height: 22px;
`;

export const Subtitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-style: normal;
  font-weight: 600;
`;

export const ImageTypeButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Separator = styled.div`
  margin: 0 10px;
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const ImageTypeSelector = styled.div`
  padding: 10px 0 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const CustomImage = styled.div`
  margin: 10px 0 0 0;
  position: relative;
  display: flex;
  height: 280px;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  border: 1px dashed ${(props) => props.theme.text};
  border-radius: 8px;

  &.error {
    border: 1px dashed ${(props) => props.theme.danger};
  }
`;

export const Uploader = styled.div`
  button {
    margin: 120px 0 0 0;
    min-width: 210px;
    z-index: inherit;
  }
`;

export const DragAndDropPrompt = styled.div`
  margin: -40px 0 0 0;
  padding: 0px 50px;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  gap: 20px;
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

export const PreviewImage = styled.div`
  width: 100%;

  img {
    border-radius: 8px;
  }
`;

export const ClearSelectedImage = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;

  button {
    min-width: 0;
    margin: 0;
  }
`;

export const Loader = styled.div`
  height: 290px;
`;

export const AIInputsContainer = styled.div`
  margin: 10px 0 0 0;
`;

export const AIInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const AIImagesContainer = styled.div`
  padding: 10px;
  height: 320px;
  border-radius: 4px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};

  &.withoutHeight {
    height: initial;
  }
`;

export const AIImagesGrid = styled.div`
  padding: 8px 0 0 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const SelectedAIImage = styled.div`
  padding: 8px 0 0 0;
  position: relative;
`;

export const ClearSelectedAIImage = styled.div`
  position: absolute;
  right: 10px;
  top: 18px;
`;

export const CreateAIImagesButton = styled.div`
  padding: 5px 0 0 0;
  display: flex;
  justify-content: flex-end;
`;

export const ClearAIImagesButton = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  justify-content: flex-start;
`;

export const Actions = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;

  button {
    min-width: 140px;
    justify-content: center;
  }
`;

export const ClearConfirmContainer = styled.div`
  padding: 16px 20px 20px 20px;
  display: grid;
  grid-template-columns: 20px 1fr;
  background: ${(props) => props.theme.danger && rgba(props.theme.danger, 0.6)};
  border-radius: 4px;
  gap: 10px;
`;

export const AlertIcon = styled.div`
  padding: 4px 0 0 0;
`;

export const ClearConfirmInner = styled.div``;

export const ClearConfirmActions = styled.div`
  padding: 20px 0 0 0;
  display: flex;
  justify-content: space-between;
`;

export const Warning = styled.div`
  padding: 0 10px;
`;
