import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {OptionInterface} from '@momentum-xyz/ui-kit';
import {Select, Button, ButtonRound, Hexagon} from '@momentum-xyz/ui-kit-storybook';
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
    inputMuted: boolean | undefined;
    outputMuted: boolean | undefined;
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
  const [inputMuted, setInputMuted] = useState(rest.inputMuted);
  const [outputMuted, setOutputMuted] = useState(rest.outputMuted);

  const handleSubmit = () => {
    const data = {
      inputAudioDeviceId,
      outputAudioDeviceId,
      inputMuted,
      outputMuted
    };
    onSubmit(data);
  };

  return (
    <styled.Container>
      <Frame>
        <styled.DeviceItem>
          <ButtonRound variant="primary" isLabel icon="microphoneOn" />
          <Select
            placeholder={`${t('devices.selectInputSource')}`}
            value={(inputAudioDeviceId || null) as any}
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
            options={audioDeviceList}
            onSingleChange={(value) => {
              if (!value) {
                return;
              }
              setOutputAudioDeviceId(value);
            }}
          />
        </styled.DeviceItem>
        <styled.Controls>
          <Hexagon
            type="secondary"
            iconName={inputMuted ? 'microphoneOff' : 'microphoneOn'}
            onClick={() => setInputMuted(!inputMuted)}
          />
          <Hexagon
            type="secondary"
            iconName={outputMuted ? 'sound_off' : 'sound'}
            onClick={() => setOutputMuted(!outputMuted)}
          />
        </styled.Controls>
        <styled.Actions>
          <Button variant="secondary" label={t('actions.cancel')} onClick={onCancel} />
          <Button label={t('actions.save')} disabled={isUpdating} onClick={handleSubmit} />
        </styled.Actions>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileSettings);
