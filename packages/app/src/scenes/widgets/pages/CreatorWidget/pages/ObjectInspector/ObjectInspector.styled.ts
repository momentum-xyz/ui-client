import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0 10px 10px;
  position: relative;
  height: 100%;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  &.color-picker {
    padding: 30px 10px 10px 10px;
  }

  &.large-gap {
    gap: 30px;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: scroll;
  margin-right: -10px;
  margin-top: 8px;
  padding-right: 10px;
`;

export const MainTitle = styled.h1`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;
  margin: 10px 0;
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  text-transform: uppercase;
  margin: 10px 0;
`;

export const ObjectPreviewModelContainer = styled.div``;

export const Separator = styled.div`
  height: 1px;
  min-height: 1px;
  width: 100%;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  margin: 20px 0;
`;

export const Form = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
  align-items: center;
`;

export const VideoWrapper = styled.div`
  iframe {
    min-height: 265px;
  }
`;

export const StickyActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 10px;
  position: sticky;
  bottom: 0;
`;
