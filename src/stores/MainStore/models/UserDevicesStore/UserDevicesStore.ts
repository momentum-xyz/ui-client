import {flow, Instance, types} from 'mobx-state-tree';
import {ILocalAudioTrack, ILocalVideoTrack} from 'agora-rtc-sdk-ng';

import {DialogModel, ResetModel} from 'core/models';
import {storage} from 'core/services';
import {StorageKeyEnum} from 'core/enums';

const UserDevicesStore = types
  .compose(
    ResetModel,
    types
      .model('UserDevicesStore', {
        microphoneConsent: false,
        cameraConsent: false,
        microphoneAccessDialog: types.optional(DialogModel, {}),
        cameraAccessDialog: types.optional(DialogModel, {}),
        microphoneRequirementDialog: types.optional(DialogModel, {}),
        cameraRequirementDialog: types.optional(DialogModel, {}),
        muted: true,
        camerOff: true
      })
      .volatile<{
        audioInputs: MediaDeviceInfo[];
        videoInputs: MediaDeviceInfo[];
        currentVideoInput?: MediaDeviceInfo;
        currentAudioInput?: MediaDeviceInfo;
        localVideoTrack?: ILocalVideoTrack;
        localAudioTrack?: ILocalAudioTrack;
      }>(() => ({
        audioInputs: [],
        videoInputs: []
      }))
  )
  .actions((self) => ({
    getMicrophoneConsent: flow(function* () {
      if (!self.microphoneConsent) {
        self.microphoneAccessDialog.open();
        try {
          yield navigator.mediaDevices.getUserMedia({audio: true});
          self.microphoneAccessDialog.close();
          self.microphoneConsent = true;
        } catch {
          self.microphoneRequirementDialog.open();
          self.microphoneConsent = false;
        }
      }
    }),
    getCameraConsent: flow(function* () {
      if (!self.cameraConsent) {
        const shouldNotShowCameraDialog = storage.get(StorageKeyEnum.NoCameraInfo);

        if (shouldNotShowCameraDialog) {
          self.cameraAccessDialog.open();
        }

        try {
          yield navigator.mediaDevices.getUserMedia({video: true});
          self.cameraAccessDialog.close();
          self.cameraConsent = true;
        } catch {
          self.cameraRequirementDialog.open();
        }
      }
    }),
    doNotShowCameraRequirementDialogAgain() {
      storage.set(StorageKeyEnum.NoCameraInfo, 1);
    }
  }))
  .actions((self) => ({
    init: flow(function* (
      currentAudioInput: MediaDeviceInfo | undefined,
      currentVideoInput: MediaDeviceInfo | undefined
    ) {
      self.currentAudioInput = currentAudioInput;
      self.currentVideoInput = currentVideoInput;

      self.getMicrophoneConsent();
      self.getMicrophoneConsent();

      if (self.microphoneConsent) {
        const devices = yield navigator.mediaDevices.enumerateDevices();

        self.audioInputs = devices.filter(
          (device: MediaDeviceInfo) => device.kind === 'audioinput'
        );
      }

      if (self.cameraConsent) {
        const devices = yield navigator.mediaDevices.enumerateDevices();

        self.videoInputs = devices.filter(
          (device: MediaDeviceInfo) => device.kind === 'videoinput'
        );
      }
    }),
    selectAudioInput(deviceId: string) {
      const device = self.audioInputs.find((device) => device.deviceId === deviceId);
      self.currentAudioInput = device;
    },
    selectVideoInput(deviceId: string) {
      const device = self.videoInputs.find((device) => device.deviceId === deviceId);
      self.currentVideoInput = device;
    },
    createLocalTracks: flow(function* (
      createAudioTrack: (deviceId?: string) => Promise<ILocalAudioTrack>,
      createVideoTrack: (deviceId?: string) => Promise<ILocalVideoTrack>
    ) {
      if (!self.microphoneConsent) {
        yield self.getMicrophoneConsent();
      }

      self.localAudioTrack = yield createAudioTrack(self.currentAudioInput?.deviceId);
      self.localAudioTrack?.setEnabled(!self.muted);

      if (!self.cameraConsent) {
        yield self.getCameraConsent();
      }

      self.localVideoTrack = self.currentVideoInput?.deviceId
        ? yield createVideoTrack(self.currentVideoInput?.deviceId)
        : undefined;

      self.localVideoTrack?.setEnabled(!self.camerOff);
    }),
    mute: flow(function* () {
      if (!self.localAudioTrack) {
        return;
      }

      yield self.localAudioTrack?.setEnabled(false);
      self.muted = true;
    }),
    unmute: flow(function* () {
      if (!self.localAudioTrack) {
        return;
      }

      yield self.localAudioTrack?.setEnabled(true);
      self.muted = false;
    }),
    turnOffCamera: flow(function* () {
      if (!self.localVideoTrack) {
        return;
      }

      yield self.localVideoTrack?.setEnabled(false);
      self.camerOff = true;
    }),
    turnOnCamera: flow(function* () {
      if (!self.localVideoTrack) {
        return;
      }

      yield self.localVideoTrack?.setEnabled(true);
      self.camerOff = false;
    })
  }));

export interface UserDevicesStoreInterface extends Instance<typeof UserDevicesStore> {}

export {UserDevicesStore};
