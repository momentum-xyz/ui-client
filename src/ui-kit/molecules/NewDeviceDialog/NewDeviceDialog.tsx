import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {Dialog, Dropdown, Text, Heading} from 'ui-kit';

import * as styled from './NewDeviceDialog.styled';

export interface NewDevicePopupPropsInterface {
  onClose: () => void;
  deviceKindDescription?: string;
  deviceLabel?: string;
}

const NewDevicePopup: React.FC<NewDevicePopupPropsInterface> = ({
  onClose,
  deviceKindDescription,
  deviceLabel
}) => {
  const {agoraStore} = useStore().mainStore;
  const {userDevicesStore} = agoraStore;

  const {t} = useTranslation();

  return (
    <Dialog
      title={t('titles.newDeviceDetected')}
      onClose={onClose}
      layoutSize={{width: '360px'}}
      headerStyle="uppercase"
      approveInfo={{
        title: t('actions.switchDevice'),
        onClick: onClose
      }}
      showCloseButton
    >
      <styled.Body>
        <Text
          text={t('messages.newDeviceDetected', {
            deviceKind: deviceKindDescription,
            deviceName: deviceLabel
          })}
          size="m"
          align="left"
        />
        <Heading
          label={t(`${t('devices.video')} ${t('devices.device')}`)}
          type="h3"
          transform="uppercase"
          weight="bold"
          align="left"
        />
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
        <Heading
          label={t(`${t('devices.audio')} ${t('devices.device')}`)}
          type="h3"
          transform="uppercase"
          weight="bold"
          align="left"
        />
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
      </styled.Body>
    </Dialog>
  );
};

export default observer(NewDevicePopup);
