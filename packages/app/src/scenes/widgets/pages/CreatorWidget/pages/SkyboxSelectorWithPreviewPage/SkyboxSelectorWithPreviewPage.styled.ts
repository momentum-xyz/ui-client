import styled from 'styled-components';
import {rgba} from 'polished';

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

  &.blur {
    filter: blur(5px);
  }
`;

export const PreviewContainer = styled.div`
  width: 700px;
  height: 600px;
  position: relative;
`;

export const DeleteButtonHolder = styled.div`
  position: absolute;
  top: 9px;
  right: 9px;
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
  margin-left: 30px;
  margin-bottom: 10px;
`;

export const SkyboxCount = styled.div`
  padding: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
`;

export const SkyboxesContainer = styled.div`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const ItemsPage = styled.div`
  display: flex;
`;

export const Item = styled.div`
  width: 180px;
  height: 290px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
  margin: 0 15px;
  position: relative;

  box-shadow: 0px 3.369px 3.369px rgba(0, 0, 0, 0.25);

  border: 3px solid transparent;
  &.active {
    border: 3px solid var(--accent-color);
  }
`;

export const ItemTitle = styled.div`
  color: var(--accent-color);
  text-transform: uppercase;
  font-size: var(--font-size-l);

  height: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @supports (-webkit-line-clamp: 2) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

export const ItemCreatedBy = styled.div`
  color: var(--white);
  font-size: var(--font-size-l);

  & span {
    text-transform: uppercase;
    color: var(--accent-color);
  }
`;

export const ItemButtonHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonsHolder = styled.div`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
  padding: 10px;
  border-radius: 10px;
`;

export const Pager = styled.div`
  padding: 0 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
  margin-top: 40px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 0;
  width: fit-content;
`;
export const PageDot = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 100%;
  background: var(--accent-color);
  opacity: 0.3;
  cursor: pointer;
  &:hover {
    opacity: 0.75;
  }
  &.active-page {
    opacity: 1;
  }
`;

export const PagerArrowHolder = styled.div`
  padding: 10px 0px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  }
`;

export const Separator = styled.div`
  height: 1px;
  width: calc(100% - 20px);
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  margin: 10px;
`;

export const ContainerNew = styled.div``;
export const ControlsContainer = styled.div``;
export const ControlsInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const SkyboxTypeContainer = styled.div`
  display: flex;
  border: 0.2px solid ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
  border-radius: 4px;
  & > button {
    flex: 1;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -0.2px;
    &:not(.active) {
      box-shadow: none;
      border-color: transparent;
      background: transparent;
    }
  }
`;
export const SkyboxSearchContainer = styled.div``;
export const SkyboxListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2em;
  line-height: 24px;
  text-transform: uppercase;
  margin-bottom: 10px;
`;
