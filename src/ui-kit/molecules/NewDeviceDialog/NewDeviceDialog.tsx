import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Dialog, Dropdown, Text, Heading} from 'ui-kit';

import * as styled from './NewDeviceDialog.styled';

const NEWDEVICE_DIALOG_WIDTH = '360px';

export interface NewDevicePopupPropsInterface {
  onClose: () => void;
  deviceKindDescription?: string;
  deviceLabel?: string;
  audioDevices: MediaDeviceInfo[];
  videoDevices: MediaDeviceInfo[];
  currentAudioDeviceId?: string;
  currentVideoDeviceId?: string;
  onAudioDeviceSelect: (deviceId: string) => void;
  onVideoDeviceSelect: (deviceId: string) => void;
}

const NewDevicePopup: React.FC<NewDevicePopupPropsInterface> = ({
  onClose,
  deviceKindDescription,
  deviceLabel,
  audioDevices,
  videoDevices,
  currentAudioDeviceId,
  currentVideoDeviceId,
  onAudioDeviceSelect,
  onVideoDeviceSelect
}) => {
  const {t} = useTranslation();

  return (
    <Dialog
      title={t('titles.newDeviceDetected')}
      onClose={onClose}
      layoutSize={{width: NEWDEVICE_DIALOG_WIDTH}}
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
          value={currentVideoDeviceId}
          options={videoDevices.map((input) => ({
            label: input.label,
            value: input.deviceId
          }))}
          onOptionSelect={(option) => {
            onVideoDeviceSelect(option.value);
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
          value={currentAudioDeviceId}
          options={audioDevices.map((input) => ({
            label: input.label,
            value: input.deviceId
          }))}
          onOptionSelect={(option) => {
            onAudioDeviceSelect(option.value);
          }}
          dropdownSize="small"
        />
      </styled.Body>
    </Dialog>
  );
};

export default observer(NewDevicePopup);
