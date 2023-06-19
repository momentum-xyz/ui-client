import styled from 'styled-components';

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
  display: flex;
  height: var(--height);
  align-items: center;
  justify-content: center;
  border: 1px dashed ${(props) => props.theme.text};
  border-radius: var(--radius);
`;

export const PreviewImageContainer = styled.div<{url: string}>`
  position: relative;
  display: flex;
  height: var(--height);
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background-image: url(${(props) => props.url});
  background-position: center center;
  background-size: cover;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
