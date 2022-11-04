import styled from 'styled-components';

export const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const SpaceLayout = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
  width: 100%;
`;

export const SpaceNav = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 120px;
  border: 1px solid grey;
  border-radius: 4px;
  padding: 10px;
  margin: 10px;
  gap: 10px;
`;

export const SpaceTab = styled.button`
  border: 1px solid grey;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: grey;
  }
`;

export const SpaceContent = styled.div`
  flex: 1 0 auto;
  border: 1px solid grey;
  margin: 10px;
`;
