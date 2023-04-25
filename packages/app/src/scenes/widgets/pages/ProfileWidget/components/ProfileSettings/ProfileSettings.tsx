import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {OptionInterface} from '@momentum-xyz/ui-kit';
import {Select, Button, ButtonRound} from '@momentum-xyz/ui-kit-storybook';
import {Frame} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './ProfileSettings.styled';

interface PropsInterface {
  inputAudioDeviceId?: string;
  outputAudioDeviceId?: string;
  inputMuted?: boolean;
  outputMuted?: boolean;
  audioDeviceList: OptionInterface[];
  isUpdating: boolean;
  onCancel: () => void;
  onSubmit: (data: {
    inputAudioDeviceId: string | undefined;
    outputAudioDeviceId: string | undefined;
  }) => void;
}

const ProfileSettings: FC<PropsInterface> = ({
  audioDeviceList,
  isUpdating,
  onSubmit,
  onCancel,
  ...rest
}) => {
  const {t} = useI18n();

  const [inputAudioDeviceId, setInputAudioDeviceId] = useState(rest.inputAudioDeviceId);
  const [outputAudioDeviceId, setOutputAudioDeviceId] = useState(rest.outputAudioDeviceId);

  const handleSubmit = () => {
    const data = {inputAudioDeviceId, outputAudioDeviceId};
    onSubmit(data);
  };

  return (
    <styled.Container>
      <Frame>
        <styled.Title>{t('labels.sound')}</styled.Title>
        <styled.DeviceItem>
          <ButtonRound variant="primary" isLabel icon="microphoneOn" />
          <Select
            placeholder={`${t('devices.selectInputSource')}`}
            value={(inputAudioDeviceId || null) as any}
            // @ts-ignore
            options={audioDeviceList}
            onSingleChange={(value) => {
              if (!value) {
                return;
              }
              setInputAudioDeviceId(value);
            }}
          />
        </styled.DeviceItem>
        <styled.DeviceItem>
          <ButtonRound variant="primary" isLabel icon="sound_louder" />
          <Select
            placeholder={`${t('devices.selectOutputSource')}`}
            value={(outputAudioDeviceId || null) as any}
            // @ts-ignore
            options={audioDeviceList}
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
          <Button label={t('actions.save')} disabled={isUpdating} onClick={handleSubmit} />
        </styled.Actions>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileSettings);
