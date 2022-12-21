import styled from 'styled-components';
import {rgba} from 'polished';
import {Button} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 500px;
  min-width: 500px;
  width: 100%;
  pointer-events: none;
  align-items: center;
  justify-content: center;
  gap: 50px;
  padding-top: 80px;
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
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 50%;
`;

export const ItemsGallery = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SkyboxCountContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-left: 150px;
  margin-bottom: 10px;
`;

export const SkyboxCount = styled.div`
  padding: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
`;

export const Item = styled.div`
  width: 180px;
  height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
  margin: 0 15px;

  box-shadow: 0px 3.369px 3.369px rgba(0, 0, 0, 0.25);

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

export const CloseButton = styled(Button)`
  pointer-events: all;
`;