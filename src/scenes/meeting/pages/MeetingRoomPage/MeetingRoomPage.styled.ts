import styled from 'styled-components';

export const ListItem = styled.li`
  padding-right: 1px;
  align-items: end;
  display: flex;
  flex-direction: column;
  position: absolute;
  transform: translateX(-400px);
  width: 400px;
  height: calc(100vh - 80px);
  pointer-events: none;
  gap: 10px;
`;

export const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  align-items: center;
  pointer-events: auto;
`;

export const MuteButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  align-items: center;
  padding: 9px 0 5px;
`;

export const MuteButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 80px;
  border-radius: 100%;
  background: ${(props) => props.theme.bg};
`;
