import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 10px;
  width: 400px;
  margin-top: 20px;
  max-height: calc(100% - 50px);
`;

export const AvatarSettings = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const AvatarContainer = styled.div`
  flex-shrink: 0;
`;
