import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  pointer-events: all;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &.margin-top {
    margin-top: 30px;
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

export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
`;
export const ControlsRowTitle = styled.span`
  flex: 0 0 150px;
`;
export const ControlsRowInputsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;
export const ControlsRowInputContainer = styled.div`
  display: flex;
  align-items: center;
  & input,
  & div {
    width: 60px;
  }
`;
export const ControlsRowInputTitle = styled.h1`
  margin-right: 14px;
`;
