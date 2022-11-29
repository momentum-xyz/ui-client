import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  min-height: 500px;
  min-width: 500px;
  width: 70%;
`;

export const PreviewContainer = styled.div`
  width: 700px;
  height: 600px;
  position: relative;
`;

export const PreviewTitleHolder = styled.div`
  padding: 20px;
  width: 100%;
`;

export const PreviewImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
`;

export const ItemsGallery = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
export const Item = styled.div`
  min-width: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.3)};

  &.active {
    border: 3px solid var(--accent-color);
  }
`;

export const ItemTitle = styled.div`
  color: var(--accent-color);
  text-transform: uppercase;
  font-size: var(--font-size-l);
`;

export const ItemButtonHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ActionButtonHolder = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
