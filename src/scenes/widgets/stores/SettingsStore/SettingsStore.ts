import {types, flow} from 'mobx-state-tree';

import {DialogModel, ResetModel} from 'core/models';

const SettingsStore = types
  .compose(
    ResetModel,
    types.model('SettingsStore', {
      dialog: types.optional(DialogModel, {}),
      audioInputs: types.optional(types.array(types.frozen<MediaDeviceInfo>()), []),
      videoInputs: types.optional(types.array(types.frozen<MediaDeviceInfo>()), []),
      currentVideoInput: types.maybeNull(types.frozen<MediaDeviceInfo>()),
      currentAudioInput: types.maybeNull(types.frozen<MediaDeviceInfo>())
    })
  )
  .actions((self) => ({
    init: flow(function* (
      getMicrophoneConsent: () => Promise<boolean>,
      getCameraConsent: () => Promise<boolean>,
      currentAudioInput: MediaDeviceInfo | null,
      currentVideoInput: MediaDeviceInfo | null
    ) {
      self.currentAudioInput = currentAudioInput;
      self.currentVideoInput = currentVideoInput;

      const [microphoneConsent, cameraConsent] = yield Promise.all([
        getMicrophoneConsent(),
        getCameraConsent()
      ]);

      if (microphoneConsent) {
        const devices = yield navigator.mediaDevices.enumerateDevices();
        self.audioInputs = devices.filter((device) => device.kind === 'audioinput');
      }

      if (cameraConsent) {
        const devices = yield navigator.mediaDevices.enumerateDevices();
        self.videoInputs = devices.filter((device) => device.kind === 'videoinput');
      }
    }),
    selectAudioInput(deviceId: string) {
      const device = self.audioInputs.find((device) => device.deviceId === deviceId);
      self.currentAudioInput = device ?? null;
    },
    selectVideoInput(deviceId: string) {
      const device = self.videoInputs.find((device) => device.deviceId === deviceId);
      self.currentVideoInput = device ?? null;
    }
  }));

export {SettingsStore};
