import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 455px;

  display: flex;
  gap: 12px;
`;
export const PanelContainer = styled.div`
  display: flex;
`;

export const Wrapper = styled.div`
  padding: 0;
`;

export const SideMenuContainer = styled.div`
  margin-top: 14px;
`;

export const GeneralScrollable = styled.div`
  margin: 0 10px;
  display: flex;
  height: calc(100vh - var(--scroll-offset));
  flex-direction: column;
  overflow: auto;
`;
