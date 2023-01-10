import styled from 'styled-components';

export const SpaceLayout = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
  width: 100%;
`;

export const SpaceTopBar = styled.div`
  display: flex;
  height: 50px;
  border: 1px solid grey;
  border-radius: 4px;
  margin: 10px;
  padding: 10px;
  gap: 10px;
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

export const SpaceTabContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

export const SpaceContent = styled.div`
  display: flex;
  flex: 1 0 auto;
  border: 1px solid grey;
  margin: 10px;
  justify-content: end;
  align-items: end;

  // :not(&.expanded) {
  //   width: 679px;
  //   height: 348px;
  //   align-self: flex-end;
  //   flex: 0 0 auto;
  // }
`;
