import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {Heading, IconSvg} from '@momentum-xyz/ui-kit';

import * as styled from './ProfileSettings.styled';

interface PropsInterface {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onLogout: () => void;
}

const ProfileSettings: FC<PropsInterface> = (props) => {
  const {isEditMode, onToggleEditMode, onLogout} = props;

  return (
    <styled.Settings>
      <styled.SettingsHeader>
        <IconSvg name="gear" size="normal" />
        <Heading type="h2" label="Settings" align="left" weight="bold" />
      </styled.SettingsHeader>

      <styled.SettingsContainer>
        <styled.SettingsItem className={cn(isEditMode && 'active')}>
          <IconSvg name={!isEditMode ? 'edit' : 'check'} size="normal" />
          <styled.SettingsValue onClick={onToggleEditMode}>Edit profile</styled.SettingsValue>
        </styled.SettingsItem>
        <styled.SettingsItem>
          <IconSvg name="gear" size="normal" />
          <styled.SettingsValue>Device settings</styled.SettingsValue>
        </styled.SettingsItem>
        <styled.SettingsItem>
          <IconSvg name="exit" size="normal" />
          <styled.SettingsValue onClick={onLogout}>Logout</styled.SettingsValue>
        </styled.SettingsItem>
      </styled.SettingsContainer>
    </styled.Settings>
  );
};

export default observer(ProfileSettings);
