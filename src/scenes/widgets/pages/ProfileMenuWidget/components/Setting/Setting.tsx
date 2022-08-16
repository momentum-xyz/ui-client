import React, {FC, useRef} from 'react';
import {capitalize} from 'lodash';
import {t} from 'i18next';

import {Dropdown, Heading, Text, useClickOutside} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './Setting.styled';

const Setting: FC = () => {
  const {mainStore, widgetStore} = useStore();
  const {profileMenuStore} = widgetStore;
  const {agoraStore} = mainStore;
  const {userDevicesStore} = agoraStore;

  const settingRef = useRef<HTMLDivElement>(null);

  useClickOutside(settingRef, () => {
    profileMenuStore.closeSetting();
    profileMenuStore.profileMenuDialog.close();
  });

  return (
    <styled.Container ref={settingRef} data-testid="Setting-test">
      <Heading
        label={capitalize(`${t('devices.device')} ${t('labels.settings')}`)}
        type="h2"
        align="left"
      />
      <styled.DeviceInput>
        <Text
          text={t('devices.camera')}
          size="xxs"
          align="right"
          weight="bold"
          transform="uppercase"
        />
        <styled.DropdownContainer>
          <Dropdown
            placeholder={`${t('devices.video')} ${t('devices.device')}`}
            variant="secondary"
            value={userDevicesStore.currentVideoInput?.deviceId}
            options={userDevicesStore.videoInputsOption}
            onOptionSelect={(option) => {
              userDevicesStore.selectVideoInput(option.value);
            }}
            dropdownSize="small"
          />
        </styled.DropdownContainer>
      </styled.DeviceInput>
      <styled.DeviceInput>
        <Text
          text={t('devices.microphone')}
          size="xxs"
          align="right"
          weight="bold"
          transform="uppercase"
        />
        <styled.DropdownContainer>
          <Dropdown
            placeholder={`${t('devices.audio')} ${t('devices.device')}`}
            variant="secondary"
            value={userDevicesStore.currentAudioInput?.deviceId}
            options={userDevicesStore.audioInputOptions}
            onOptionSelect={(option) => {
              userDevicesStore.selectAudioInput(option.value);
            }}
            dropdownSize="small"
          />
        </styled.DropdownContainer>
      </styled.DeviceInput>
    </styled.Container>
  );
};

export default Setting;
