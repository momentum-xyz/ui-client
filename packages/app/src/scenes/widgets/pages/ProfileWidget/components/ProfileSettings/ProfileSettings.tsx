import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Dropdown, Heading, IconSvg, OptionInterface} from '@momentum-xyz/ui-kit';
import cn from 'classnames';

import * as styled from './ProfileSettings.styled';

interface PropsInterface {
  isEditMode: boolean;
  isDeviceSettings: boolean;
  audioDeviceId?: string;
  audioDeviceList: OptionInterface[];
  onSelectAudioDevice: (id: string) => void;
  onToggleEditMode: () => void;
  onToggleDeviceSettings: () => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

const ProfileSettings: FC<PropsInterface> = ({
  isEditMode,
  isDeviceSettings,
  audioDeviceId,
  audioDeviceList,
  onSelectAudioDevice,
  onToggleDeviceSettings,
  onToggleEditMode,
  onSignIn,
  onSignOut
}) => {
  const {t} = useTranslation();

  return (
    <styled.Settings>
      <styled.SettingsHeader>
        <IconSvg name="gear" size="normal" />
        <Heading type="h2" label="Settings" align="left" weight="bold" />
      </styled.SettingsHeader>

      <styled.SettingsContainer>
        <styled.SettingsItem className={cn(isEditMode && 'active')}>
          <IconSvg name={!isEditMode ? 'pencil' : 'check'} size="normal" />
          <styled.SettingsValue onClick={onToggleEditMode}>Edit profile</styled.SettingsValue>
        </styled.SettingsItem>

        <styled.SettingsItem className={cn(isDeviceSettings && 'active')}>
          <IconSvg name={!isDeviceSettings ? 'gear' : 'check'} size="normal" />
          <styled.SettingsValue onClick={onToggleDeviceSettings}>
            Device settings
          </styled.SettingsValue>
        </styled.SettingsItem>

        {isDeviceSettings && (
          <styled.DeviceItem>
            <IconSvg name="microphoneOn" size="normal" />
            <Dropdown
              placeholder={`${t('devices.audio')}`}
              variant="third"
              value={audioDeviceId}
              options={audioDeviceList}
              onOptionSelect={(option) => {
                onSelectAudioDevice(option.value);
              }}
              dropdownSize="small"
            />
          </styled.DeviceItem>
        )}

        <styled.SettingsItem>
          {onSignOut && (
            <>
              <IconSvg name="go" size="normal" />
              <styled.SettingsValue onClick={() => onSignOut()}>
                {t('actions.signOut')}
              </styled.SettingsValue>
            </>
          )}
          {onSignIn && (
            <>
              <IconSvg name="shield-open" size="normal" />
              <styled.SettingsValue onClick={() => onSignIn()}>
                {t('actions.signIn')}
              </styled.SettingsValue>
            </>
          )}
        </styled.SettingsItem>
      </styled.SettingsContainer>
    </styled.Settings>
  );
};

export default observer(ProfileSettings);
