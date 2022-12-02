import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  width: 100%;
`;

export const AvatarContainer = styled.div`
  padding: 0 12px;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const NameContainer = styled.div`
  max-width: 160px;
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Info = styled.div`
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Link = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
  color: var(--white);
`;

export const LocationText = styled(Text)`
  max-width: 250px;
`;

export const Settings = styled.div`
  padding: 0 12px 12px 12px;
`;

export const SettingsHeader = styled.div`
  padding: 6px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SettingsContainer = styled.div`
  padding: 0 8px;
`;

export const SettingsItem = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgba(255, 242, 241, 0.2);
  gap: 10px;
`;

export const SettingsValue = styled.a`
  font-size: var(--font-size-xs);
  font-weight: 400;
`;
