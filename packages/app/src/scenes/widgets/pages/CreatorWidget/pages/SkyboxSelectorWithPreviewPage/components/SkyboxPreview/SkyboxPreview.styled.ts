import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 80px;
  min-height: calc(100vh - 370px);
  max-height: calc(100vh - 370px);
  overflow: scroll;
  justify-content: space-between;
`;
export const SkyboxInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SkyboxTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  margin: 10px 0 42px;
  letter-spacing: 0.2em;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const SkyboxInfoLine = styled.div``;
export const ControlsRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
