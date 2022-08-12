import styled from 'styled-components';

export const MuteButtonContainer = styled.li`
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  align-items: center;
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
