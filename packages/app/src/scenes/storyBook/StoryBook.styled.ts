import styled from 'styled-components';

export const StoryBook = styled.div<{background: string}>`
  pointer-events: all;
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
  display: flex;
  width: 320px;
  flex-direction: column;
  gap: 10px;
`;

export const Content = styled.div`
  padding: 0 0 10px 0;
  display: flex;
  width: 100%;
  border-radius: 10px;
  background-color: rgba(32, 42, 68, 0.7);
  flex-direction: row;
  gap: 10px;
`;

export const Components = styled.div`
  padding: 10px 10px 0 0;
  width: 100%;
`;
