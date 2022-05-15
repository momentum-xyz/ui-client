import React, {FC, useEffect, useContext} from 'react';
import {t} from 'i18next';
import {capitalize} from 'lodash';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {Dialog, Dropdown, Heading, Text} from 'ui-kit';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';
import {
  COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
  COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE
} from 'context/Collaboration/CollaborationReducer';
import {AgoraContext} from 'context/AgoraContext';

import * as styled from './SettingsWidget.styled';

const DIALOG_OFFSET_RIGHT = 20;
const DIALOG_OFFSET_BOTTOM = 60;

const SettingsWidget: FC = () => {
  const {
    widgetStore: {settingsStore}
  } = useStore();
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {getMicrophoneConsent, getCameraConsent} = useContext(AgoraContext);

  useEffect(() => {
    settingsStore.init(
      getMicrophoneConsent,
      getCameraConsent,
      collaborationState.audioDevice,
      collaborationState.videoDevice
    );

    return settingsStore.resetModel;
  }, []);

  useEffect(() => {
    if (settingsStore.currentAudioInput) {
      collaborationDispatch({
        type: COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
        audioDevice: settingsStore.currentAudioInput
      });
    }
  }, [settingsStore.currentAudioInput]);

  useEffect(() => {
    if (settingsStore.currentVideoInput) {
      collaborationDispatch({
        type: COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE,
        videoDevice: settingsStore.currentVideoInput
      });
    }
  }, [settingsStore.currentVideoInput]);

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
              value={settingsStore.currentVideoInput?.deviceId}
              options={settingsStore.videoInputs.map((input) => ({
                label: input.label,
                value: input.deviceId
              }))}
              onOptionSelect={(option) => {
                settingsStore.selectVideoInput(option.value);
              }}
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
              value={settingsStore.currentAudioInput?.deviceId}
              options={settingsStore.audioInputs.map((input) => ({
                label: input.label,
                value: input.deviceId
              }))}
              onOptionSelect={(option) => {
                settingsStore.selectAudioInput(option.value);
              }}
            />
          </styled.DropdownContainer>
        </styled.DeviceInput>
      </styled.Container>
    </Dialog>
  );
};

export default observer(SettingsWidget);
