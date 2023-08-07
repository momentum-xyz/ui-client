import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  flex-grow: 1;
  overflow: hidden;
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  text-transform: uppercase;
`;

export const ObjectPreviewModelContainer = styled.div``;

export const Separator = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  margin: 20px 0;
`;
