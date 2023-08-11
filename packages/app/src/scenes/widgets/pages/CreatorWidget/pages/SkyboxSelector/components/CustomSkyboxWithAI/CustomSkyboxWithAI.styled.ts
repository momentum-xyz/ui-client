import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 0 auto;
`;

export const Header = styled.div`
  font-size: var(--font-size-s);
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const Description = styled.div``;

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
`;

export const InputsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

export const ControlsRow = styled.div`
  padding: 10px 0 10px 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
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
