import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
  // margin: 0 auto;
  display: flex;
  // width: 390px;
  gap: 10px;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 0 auto;
`;

export const Header = styled.div`
  font-size: var(--font-size-s);
  // font-family: Poppins;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const Description = styled.div`
  font-size: var(--font-size-m);
  // font-family: Poppins;
  line-height: 22px;
  letter-spacing: 0.28px;
`;

export const PromptReview = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 10px;
  marging-bottom: 10px;
`;
export const PromptReviewLabel = styled.div`
  font-weight: 700;
`;
export const PromptReviewValue = styled.div`
  font-weight: 400;
  font-style: italic;
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

export const SkyboxGenerationLoaderContainer = styled.div`
  height: 167px;
`;

export const PreviewImageHolder = styled.div`
  position: relative;
`;
export const Image = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 4px;
`;

export const Separator = styled.div`
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  margin: 10px 0;
`;
