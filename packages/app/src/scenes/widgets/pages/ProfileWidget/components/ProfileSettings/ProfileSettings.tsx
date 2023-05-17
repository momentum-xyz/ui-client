import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Select, Button, ButtonRound, SelectOptionInterface, Frame} from '@momentum-xyz/ui-kit';

import * as styled from './ProfileSettings.styled';

interface PropsInterface {
  inputAudioDeviceId?: string;
  outputAudioDeviceId?: string;
  inputAudioDeviceList: SelectOptionInterface<string>[];
  outputAudioDeviceList: SelectOptionInterface<string>[];
  onChangeAudioDevices: (inputId: string | undefined, outputId: string | undefined) => void;
  onCancel: () => void;
}

const ProfileSettings: FC<PropsInterface> = ({
  inputAudioDeviceId,
  outputAudioDeviceId,
  inputAudioDeviceList,
  outputAudioDeviceList,
  onChangeAudioDevices,
  onCancel
}) => {
  const [selectedInputAudioDeviceId, setInputAudioDeviceId] = useState(inputAudioDeviceId);
  const [selectedOutputAudioDeviceId, setOutputAudioDeviceId] = useState(outputAudioDeviceId);

  const {t} = useI18n();

  return (
    <styled.Container>
      <Frame>
        <styled.Title>{t('labels.sound')}</styled.Title>
        <styled.DeviceItem>
          <ButtonRound variant="primary" size="large" isLabel icon="microphoneOn" />
          <Select
            placeholder={`${t('devices.selectInputSource')}`}
            value={selectedInputAudioDeviceId}
            options={inputAudioDeviceList}
            onSingleChange={(value) => {
              if (!value) {
                return;
              }
              setInputAudioDeviceId(value);
            }}
          />
        </styled.DeviceItem>
        <styled.DeviceItem>
          <ButtonRound variant="primary" size="large" isLabel icon="sound_louder" />
          <Select
            placeholder={`${t('devices.selectOutputSource')}`}
            value={selectedOutputAudioDeviceId}
            options={outputAudioDeviceList}
            onSingleChange={(value) => {
              if (!value) {
                return;
              }
              setOutputAudioDeviceId(value);
            }}
          />
        </styled.DeviceItem>

        <styled.Actions>
          <Button variant="secondary" label={t('actions.cancel')} onClick={onCancel} />
          <Button
            label={t('actions.save')}
            onClick={() => {
              onChangeAudioDevices(selectedInputAudioDeviceId, selectedOutputAudioDeviceId);
            }}
          />
        </styled.Actions>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileSettings);
