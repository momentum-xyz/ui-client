import styled from 'styled-components';

export const Container = styled.div``;

export const AvatarContainer = styled.div`
  border-radius: 4px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputIconRow = styled.div`
  margin: -7px 0 0 0;
  display: grid;
  grid-template-columns: 26px 1fr;
  align-items: center;
  gap: 10px;
`;

export const Actions = styled.div`
  padding: 20px 0 10px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export const Info = styled.div`
  padding: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
