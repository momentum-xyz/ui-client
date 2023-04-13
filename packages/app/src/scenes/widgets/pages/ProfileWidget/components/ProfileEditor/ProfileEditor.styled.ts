import styled from 'styled-components';

export const Container = styled.div`
  margin-top: -16px; // TODO: Remove the margin top from the AvatarUpload component and then remove this line
`;

export const AvatarContainer = styled.div`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`;

export const InputIconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & > button {
    flex: 0 0 30px;
  }
`;

export const Actions = styled.div`
  padding: 0 0 10px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export const IsUpdating = styled.div`
  padding: 0 0 2px 0;
`;
