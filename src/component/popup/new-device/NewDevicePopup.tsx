import React, {useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import Popup, {PopupTitle} from '../../atoms/Popup';
import Select, {Option} from '../../atoms/input/Select';
import Button from '../../atoms/Button';

export interface NewDevicePopupProps {
  onClose: () => void;
  deviceKindDescription?: string;
  deviceLabel?: string;
}

const NewDevicePopup: React.FC<NewDevicePopupProps> = ({
  onClose,
  deviceKindDescription,
  deviceLabel
}) => {
  const {agoraStore} = useStore().mainStore;
  const {userDevicesStore} = agoraStore;

  useEffect(() => {
    userDevicesStore.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAudioChange = useCallback(
    (e) => {
      userDevicesStore.selectAudioInput(e.target.value);
    },
    [userDevicesStore]
  );

  const handleVideoChange = useCallback(
    (e) => {
      userDevicesStore.selectVideoInput(e.target.value);
    },
    [userDevicesStore]
  );

  return (
    <Popup className="w-360px">
      <PopupTitle onClose={onClose}>New Device Detected</PopupTitle>
      <p>
        Momentum has detected a new {deviceKindDescription} device named{' '}
        <strong>{deviceLabel}</strong>. Do you want to switch to it?
      </p>
      <p className="uppercase font-bold pt-2">Audio device</p>
      <Select value={userDevicesStore.currentAudioInput?.deviceId} onChange={handleAudioChange}>
        {userDevicesStore.audioInputs.map((input) => (
          <Option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </Option>
        ))}
      </Select>
      <p className="uppercase font-bold pt-1">Video device</p>
      <Select value={userDevicesStore.currentVideoInput?.deviceId} onChange={handleVideoChange}>
        {userDevicesStore.videoInputs.map((input) => (
          <Option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </Option>
        ))}
      </Select>
      <div className="h-1" />
      <Button type="ghost" onClick={onClose}>
        Switch device
      </Button>
    </Popup>
  );
};

export default observer(NewDevicePopup);
