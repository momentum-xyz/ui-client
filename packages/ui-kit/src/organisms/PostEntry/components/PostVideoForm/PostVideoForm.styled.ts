import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --height: 160px;
  --radius: 4px;
`;

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const EmptyContainer = styled.div`
  padding: 0 0 10px 0;
  display: flex;
  height: var(--height);
  align-items: flex-end;
  justify-content: center;
  border: 1px dashed ${(props) => props.theme.text};
  border-radius: var(--radius);
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const Message = styled.div`
  height: 22px;
`;

export const Timer = styled.div`
  height: 22px;
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.8)};
  letter-spacing: 0.02em;
`;

export const PreviewVideoContainer = styled.div`
  position: relative;
`;

export const Delete = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const FormControls = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  justify-content: space-between;
`;

export const FormControlsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
