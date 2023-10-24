import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  justify-content: space-between;
  min-height: 100%;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const ExpandHolder = styled.div``;

export const Item = styled.div`
  margin: 10px 0 0 0;
  padding: 8px 10px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.5)};
  box-shadow: -1px -1px 2px ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  border-radius: 4px;
  gap: 15px;
`;

export const Date = styled.div``;

export const Title = styled.div`
  font-size: var(--font-size-l);
  font-weight: 500;
`;

export const Description = styled.div`
  font-style: italic;
  font-weight: 300;
`;

export const LayoutCollapsed = styled.div`
  display: grid;
  grid-template-columns: 200px auto 50px;
  gap: 10px;
  width: 100%;
`;

export const LayoutExpanded = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
`;

export const BottomPanel = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export const Error = styled.div``;

export const FilePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  justify-content: center;
`;
