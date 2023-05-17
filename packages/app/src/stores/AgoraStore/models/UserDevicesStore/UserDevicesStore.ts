import {flow, types} from 'mobx-state-tree';
import AgoraRTC, {IMicrophoneAudioTrack} from 'agora-rtc-sdk-ng';
import {ResetModel, Dialog} from '@momentum-xyz/core';
import {SelectOptionInterface} from '@momentum-xyz/ui-kit';

import {storage} from 'shared/services';
import {StorageKeyEnum} from 'core/enums';

const UserDevicesStore = types
  .compose(
    ResetModel,
    types
      .model('UserDevicesStore', {
        microphoneConsent: false,
        microphoneAccessDialog: types.optional(Dialog, {}),
        microphoneRequirementDialog: types.optional(Dialog, {}),
        isTogglingMicrophone: false,
        muted: true
      })
      .volatile<{
        audioInputs: InputDeviceInfo[];
        audioOutputs: MediaDeviceInfo[];
        _currentAudioInput?: InputDeviceInfo;
        _currentAudioOutput?: MediaDeviceInfo;
        _localAudioTrack?: IMicrophoneAudioTrack;
      }>(() => ({
        audioInputs: [],
        audioOutputs: []
      }))
  )
  .views((self) => ({
    get audioInputOptions(): SelectOptionInterface<string>[] {
      return self.audioInputs.map((input) => ({
        value: input.deviceId,
        label: input.label
      }));
    },
    get audioOutputOptions(): SelectOptionInterface<string>[] {
      return self.audioOutputs.map((input) => ({
        value: input.deviceId,
        label: input.label
      }));
    },
    get currentAudioInput(): InputDeviceInfo | undefined {
      return self._currentAudioInput;
    },
    set currentAudioInput(info: InputDeviceInfo | undefined) {
      self._currentAudioInput = info;
    },
    get currentAudioOutput(): MediaDeviceInfo | undefined {
      return self._currentAudioOutput;
    },
    set currentAudioOutput(info: MediaDeviceInfo | undefined) {
      self._currentAudioOutput = info;
    },
    get localAudioTrack(): IMicrophoneAudioTrack | undefined {
      return self._localAudioTrack;
    },
    set localAudioTrack(microphoneTrack: IMicrophoneAudioTrack | undefined) {
      self._localAudioTrack = microphoneTrack;
    }
  }))
  .actions((self) => ({
    // TODO: Remove returns
    getMicrophoneConsent: flow(function* () {
      if (!self.microphoneConsent) {
        self.microphoneAccessDialog.open();
        try {
          yield navigator.mediaDevices.getUserMedia({audio: true});
          self.microphoneAccessDialog.close();
          self.microphoneConsent = true;
          return true;
        } catch {
          self.microphoneRequirementDialog.open();
          self.microphoneConsent = false;
          return false;
        }
      }

      return true;
    }),
    mute: flow(function* () {
      self.isTogglingMicrophone = true;

      if (self.localAudioTrack) {
        yield self.localAudioTrack.setEnabled(false);
      }

      self.muted = true;
      self.isTogglingMicrophone = false;
    }),
    unmute: flow(function* () {
      self.isTogglingMicrophone = true;

      if (self.localAudioTrack) {
        yield self.localAudioTrack.setEnabled(true);
      }

      self.muted = false;
      self.isTogglingMicrophone = false;
    })
  }))
  .actions((self) => ({
    createLocalAudioTrack: flow(function* (
      createAudioTrack: (
        deviceId: string,
        isTrackEnabled: boolean
      ) => Promise<IMicrophoneAudioTrack | undefined>
    ) {
      if (!self.microphoneConsent) {
        yield self.getMicrophoneConsent();
      }

      self.localAudioTrack = self.currentAudioInput?.deviceId
        ? yield createAudioTrack(self.currentAudioInput?.deviceId, !self.muted)
        : undefined;
    })
  }))
  .actions((self) => ({
    init: flow(function* () {
      yield self.getMicrophoneConsent();

      if (self.microphoneConsent) {
        const devices = yield navigator.mediaDevices.enumerateDevices();
        self.audioInputs = devices.filter((i: InputDeviceInfo) => i.kind === 'audioinput');
        self.audioOutputs = devices.filter((i: MediaDeviceInfo) => i.kind === 'audiooutput');

        try {
          const storedInputId = storage.get<string>(StorageKeyEnum.PreferredAudioInput);
          const foundInput = self.audioInputs.find((item) => item.deviceId === storedInputId);
          self.currentAudioInput = foundInput || (yield AgoraRTC.getMicrophones())[0];

          const storedOutputId = storage.get<string>(StorageKeyEnum.PreferredAudioOutput);
          const foundOutput = self.audioOutputs.find((item) => item.deviceId === storedOutputId);
          self.currentAudioOutput = foundOutput || (yield AgoraRTC.getPlaybackDevices())[0];
        } catch (error) {
          console.error('[UserDevicesStore] Got audio devices error!', error);
        }
      }
    }),
    selectAudioInput(deviceId: string) {
      self.currentAudioInput = self.audioInputs.find((device) => device.deviceId === deviceId);
      storage.set(StorageKeyEnum.PreferredAudioInput, deviceId);
    },
    selectAudioOutput(deviceId: string) {
      self.currentAudioOutput = self.audioOutputs.find((device) => device.deviceId === deviceId);
      storage.set(StorageKeyEnum.PreferredAudioOutput, deviceId);
    },
    createLocalTracks: flow(function* (
      createAudioTrack: (
        deviceId: string,
        isTrackEnabled: boolean
      ) => Promise<IMicrophoneAudioTrack | undefined>
    ) {
      yield self.createLocalAudioTrack(createAudioTrack);
    }),
    cleanupLocalTracks: flow(function* () {
      yield self.mute();
      self.localAudioTrack?.stop();
      self.localAudioTrack?.close();
      self.localAudioTrack = undefined;
    }),
    toggleMicrophone(mute?: boolean) {
      if (mute !== undefined) {
        mute ? self.mute() : self.unmute();
        return;
      }

      if (self.muted) {
        self.unmute();
      } else {
        self.mute();
      }
    }
  }));

export {UserDevicesStore};
