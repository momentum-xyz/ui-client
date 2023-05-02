import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 435px;
`;

export const ScrollableContainer = styled.div`
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;

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
