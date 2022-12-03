import styled from 'styled-components';

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
  align-items: center;
  gap: 10px;

  &.active {
    * {
      color: var(--white);
    }
  }
`;

export const SettingsValue = styled.a`
  font-size: var(--font-size-xs);
  font-weight: 400;
`;

export const DeviceItem = styled.div`
  padding: 6px 0 6px 10px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgba(255, 242, 241, 0.2);
  align-items: center;
  gap: 10px;
`;
