import React, {FC} from 'react';
import {t} from 'i18next';
import {capitalize} from 'lodash';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {Dialog, Dropdown, Heading, Text} from 'ui-kit';

import * as styled from './SettingsWidget.styled';

const DIALOG_OFFSET_RIGHT = 20;
const DIALOG_OFFSET_BOTTOM = 60;

const SettingsWidget: FC = () => {
  const {
    widgetStore: {settingsStore},
    mainStore
  } = useStore();

  const {
    agoraStore: {userDevicesStore}
  } = mainStore;

  return (
    <Dialog
      position="rightBottom"
      headerStyle="normal"
      title={t('labels.settings')}
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={settingsStore.dialog.close}
      isBodyExtendingToEdges
      showBackground={false}
      showCloseButton
    >
      <styled.Container>
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
              options={userDevicesStore.videoInputs.map((input) => ({
                label: input.label,
                value: input.deviceId
              }))}
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
              options={userDevicesStore.audioInputs.map((input) => ({
                label: input.label,
                value: input.deviceId
              }))}
              onOptionSelect={(option) => {
                userDevicesStore.selectAudioInput(option.value);
              }}
              dropdownSize="small"
            />
          </styled.DropdownContainer>
        </styled.DeviceInput>
      </styled.Container>
    </Dialog>
  );
};

export default observer(SettingsWidget);
