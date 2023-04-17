import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const ScrollableContainer = styled.div``;

export const GeneralInfo = styled.div`
  display: flex;
  flex-direction: column;
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

export const OwnedOdysseys = styled.div`
  margin: 20px 0 0 0;
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const OwnedOdysseysTitle = styled.div`
  padding: 10px 0;
  font-size: var(--font-size-l);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  display: flex;
  align-items: center;

  & > span {
    margin-right: 10px;
  }
`;
