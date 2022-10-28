import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  min-height: 500px;
  min-width: 500px;
`;

export const SideBarTitleHolder = styled.div`
  padding: 20px;
`;

export const SideBarElementHolder = styled.div`
  padding: 10px;
`;

export const SideNav = styled.div`
  display: flex;
  flex-direction: column;
  width: 180px;
`;

export const SideNavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 10px;
  color: var(--accent-color);
  width: 100%;
  cursor: pointer;
  &.active {
    background-color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  }
`;

export const SideNavItemIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  width: 100%;
  height: 100%;
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
