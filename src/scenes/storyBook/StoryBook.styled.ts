import styled from 'styled-components';

export const StoryBook = styled.div<{background: string}>`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-image: url(${(props) => props.background});
  flex-direction: row;
  flex-grow: 1;
  gap: 10px;
`;

export const SettingsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const Settings = styled.div`
  width: 320px;
`;

export const Content = styled.div`
  position: initial;
  padding: 0 0 10px 0;
  display: flex;
  width: 100%;
  border-radius: 10px;
  flex-direction: row;
  gap: 10px;
`;

export const Components = styled.div`
  padding: 10px 10px 0 0;
  width: 100%;
`;
