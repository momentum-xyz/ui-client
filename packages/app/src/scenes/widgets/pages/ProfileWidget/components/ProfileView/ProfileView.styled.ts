import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const GeneralInfo = styled.div`
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  gap: 10px;
`;

export const AvatarContainer = styled.div`
  padding: 0 12px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const NameContainer = styled.div`
  padding: 10px 0 8px 0;
  font-weight: bold;
  font-size: var(--font-size-xl);
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const LinkAccent = styled.a`
  color: ${(props) => props.theme.accentText};
`;

export const Worlds = styled.div`
  padding: 0 10px 10px 10px;
`;

export const BuyAnotherWorldPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`;
