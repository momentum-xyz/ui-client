import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
`;
export const Separator = styled.div`
  border-top: 2px solid ${(props) => props.theme.accentText};
  margin: 10px 0;
`;

export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 12px;
`;

export const ReadyText = styled.div`
  margin: 26px 0 16px;
  color: white;
`;

export const ProfileAvatarPreview = styled.div`
  width: 340px;
  height: 200px;
  background-size: cover;
  background-position: center center;
  border-radius: 4px;
`;
