import styled from 'styled-components';
import {rgba} from 'polished';

export const Content = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
`;

export const UserContainer = styled.div`
  display: flex;
  width: 136px;
  flex-direction: column;
  gap: 2px;
`;

export const User = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PilotLabel = styled.div`
  display: flex;
`;

export const Pilot = styled.div`
  max-width: 50%;
`;
