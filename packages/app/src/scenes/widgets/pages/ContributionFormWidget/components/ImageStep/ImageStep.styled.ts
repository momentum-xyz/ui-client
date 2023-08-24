import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Header = styled.div`
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 3.2px;
  font-weight: 700;
`;

export const Description = styled.div`
  line-height: 22px;
  letter-spacing: 0.28px;
`;

export const Separator = styled.div`
  margin: 10px 0;
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const SubTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-m);
  letter-spacing: 0.28px;
  font-weight: 500;
  line-height: 18px;
  gap: 10px;
`;

export const ImageTypeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const AIContainer = styled.div`
  padding: 10px;
  display: grid;
  height: 360px;
  border-radius: 4px;
  grid-template-rows: 32px 1fr 28px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
`;

export const AITitle = styled.div`
  font-size: var(--font-size-s);
  font-weight: 600;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const AIActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const AIProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Progress = styled.div`
  width: 160px;
`;

export const AIImagesGrid = styled.div`
  padding: 0 0 16px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

export const CustomImage = styled.div`
  margin: 10px 0 0 0;
  position: relative;
  display: flex;
  height: 260px;
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
