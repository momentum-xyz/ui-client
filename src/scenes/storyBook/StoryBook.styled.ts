import styled from 'styled-components';

export const StoryBook = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
`;

export const SettingsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const Settings = styled.div`
  width: 370px;
`;

export const Content = styled.div`
  flex-grow: 1;
  overflow: auto;
`;
