import {flow, Instance, types} from 'mobx-state-tree';
import AgoraRTC, {ILocalAudioTrack, ILocalVideoTrack} from 'agora-rtc-sdk-ng';

import {ResetModel, DialogModel} from 'core/models';
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
        cameraOff: true,
        isTogglingMicrophone: false,
        isTogglingCamera: false
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
    init: flow(function* () {
      self.getMicrophoneConsent();
      self.getMicrophoneConsent();

      if (self.microphoneConsent) {
        const devices = yield navigator.mediaDevices.enumerateDevices();

        self.audioInputs = devices.filter(
          (device: MediaDeviceInfo) => device.kind === 'audioinput'
        );

        try {
          self.currentAudioInput =
            self.audioInputs.find(
              (item) => item.deviceId === storage.get(StorageKeyEnum.PreferredAudioInput)
            ) ?? (yield AgoraRTC.getMicrophones())[0];
        } catch (error) {
          console.error('[UserDevicesStore] Got audio devices error!', error);
        }
      }

      if (self.cameraConsent) {
        const devices = yield navigator.mediaDevices.enumerateDevices();

        self.videoInputs = devices.filter(
          (device: MediaDeviceInfo) => device.kind === 'videoinput'
        );

        try {
          self.currentVideoInput =
            self.videoInputs.find(
              (item) => item.deviceId === storage.get(StorageKeyEnum.PreferredVideoInput)
            ) ?? (yield AgoraRTC.getCameras())[0];
        } catch (error) {
          console.error('[UserDevicesStore] Got video devices error!', error);
        }
      }
    }),
    selectAudioInput(deviceId: string) {
      const device = self.audioInputs.find((device) => device.deviceId === deviceId);
      self.currentAudioInput = device;

      storage.set(StorageKeyEnum.PreferredAudioInput, deviceId);
    },
    selectVideoInput(deviceId: string) {
      const device = self.videoInputs.find((device) => device.deviceId === deviceId);
      self.currentVideoInput = device;

      storage.set(StorageKeyEnum.PreferredVideoInput, deviceId);
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

      self.localVideoTrack?.setEnabled(!self.cameraOff);
    }),
    cleanupLocalTracks() {
      self.localAudioTrack = undefined;
      self.localVideoTrack = undefined;
    },
    mute: flow(function* () {
      if (!self.localAudioTrack) {
        return;
      }

      self.isTogglingMicrophone = true;

      yield self.localAudioTrack?.setEnabled(false);
      self.muted = true;
      self.isTogglingMicrophone = false;
    }),
    unmute: flow(function* () {
      if (!self.localAudioTrack) {
        return;
      }

      self.isTogglingMicrophone = true;

      yield self.localAudioTrack?.setEnabled(true);
      self.muted = false;
      self.isTogglingMicrophone = false;
    }),
    turnOffCamera: flow(function* () {
      if (!self.localVideoTrack) {
        return;
      }

      self.isTogglingCamera = true;

      yield self.localVideoTrack?.setEnabled(false);
      self.cameraOff = true;
      self.isTogglingCamera = false;
    }),
    turnOnCamera: flow(function* () {
      if (!self.localVideoTrack) {
        return;
      }

      self.isTogglingCamera = true;

      yield self.localVideoTrack?.setEnabled(true);
      self.cameraOff = false;
      self.isTogglingCamera = false;
    })
  }));

export interface UserDevicesStoreInterface extends Instance<typeof UserDevicesStore> {}

export {UserDevicesStore};
