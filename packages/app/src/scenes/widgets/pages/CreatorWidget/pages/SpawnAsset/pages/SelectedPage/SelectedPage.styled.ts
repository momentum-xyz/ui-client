import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 10px 0;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const PreviewContainer = styled.div`
  height: 240px;
  border: 1px solid ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  border-radius: 4px;
`;

export const ObjectTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  margin: 10px 0 10px;
  letter-spacing: 0.2em;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
  gap: 20px;
`;

export const Prop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  letter-spacing: 0.02em;
  line-height: 22px;

  & > div {
    max-width: 254px;
  }
`;

export const PropName = styled.span`
  margin-right: 5px;
`;

export const PropValue = styled.span`
  font-weight: 700;
`;

export const ObjectInfoContainer = styled.div``;

export const ControlsRow = styled.div`
  padding: 20px 0 10px 0;
  display: flex;
  justify-content: space-between;

  button {
    min-width: 160px;
    justify-content: center;
  }
`;
