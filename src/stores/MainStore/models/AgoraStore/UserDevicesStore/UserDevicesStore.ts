import {flow, Instance, types} from 'mobx-state-tree';
import AgoraRTC, {ILocalAudioTrack, ILocalVideoTrack} from 'agora-rtc-sdk-ng';

import {storage} from 'shared/services';
import {ResetModel, DialogModel} from 'core/models';
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
        _audioInputs: MediaDeviceInfo[];
        _videoInputs: MediaDeviceInfo[];
        currentVideoInput?: MediaDeviceInfo;
        currentAudioInput?: MediaDeviceInfo;
        localVideoTrack?: ILocalVideoTrack;
        localAudioTrack?: ILocalAudioTrack;
      }>(() => ({
        _audioInputs: [],
        _videoInputs: []
      }))
  )
  .views((self) => ({
    get audioInputs() {
      return self._audioInputs;
    },
    get videoInputs() {
      return self._videoInputs;
    },
    set audioInputs(audioInputs: MediaDeviceInfo[]) {
      self._audioInputs = audioInputs;
    },
    set videoInputs(videoInputs: MediaDeviceInfo[]) {
      self._videoInputs = videoInputs;
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
    // TODO: Remove returns
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
          return true;
        } catch {
          self.cameraRequirementDialog.open();
          return false;
        }
      }

      return true;
    }),
    doNotShowCameraRequirementDialogAgain() {
      storage.set(StorageKeyEnum.NoCameraInfo, 1);
    },
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
    }),
    turnOffCamera: flow(function* () {
      self.isTogglingCamera = true;

      if (self.localVideoTrack) {
        yield self.localVideoTrack.setEnabled(false);
      }

      self.cameraOff = true;
      self.isTogglingCamera = false;
    }),
    turnOnCamera: flow(function* () {
      self.isTogglingCamera = true;

      if (self.localVideoTrack) {
        yield self.localVideoTrack.setEnabled(true);
      }

      self.cameraOff = false;
      self.isTogglingCamera = false;
    })
  }))
  .actions((self) => ({
    init: flow(function* () {
      yield self.getMicrophoneConsent();
      yield self.getCameraConsent();

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
      createAudioTrack: (
        deviceId: string,
        isTrackEnabled: boolean
      ) => Promise<ILocalAudioTrack | undefined>,
      createVideoTrack: (
        deviceId: string,
        isTrackEnabled: boolean
      ) => Promise<ILocalVideoTrack | undefined>
    ) {
      if (!self.microphoneConsent) {
        yield self.getMicrophoneConsent();
      }

      self.localAudioTrack = self.currentAudioInput?.deviceId
        ? yield createAudioTrack(self.currentAudioInput?.deviceId, !self.muted)
        : undefined;

      if (!self.cameraConsent) {
        yield self.getCameraConsent();
      }

      self.localVideoTrack = self.currentVideoInput?.deviceId
        ? yield createVideoTrack(self.currentVideoInput?.deviceId, !self.cameraOff)
        : undefined;
    }),
    cleanupLocalTracks() {
      self.localAudioTrack?.setEnabled(false);
      self.localVideoTrack?.setEnabled(false);

      self.localAudioTrack?.stop();
      self.localVideoTrack?.stop();

      self.localAudioTrack?.close();
      self.localVideoTrack?.close();

      self.localAudioTrack = undefined;
      self.localVideoTrack = undefined;
    },
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
    },
    toggleCamera(turnOffCamera?: boolean) {
      if (turnOffCamera !== undefined) {
        turnOffCamera ? self.turnOffCamera() : self.turnOnCamera();
        return;
      }

      if (self.cameraOff) {
        self.turnOnCamera();
      } else {
        self.turnOffCamera();
      }
    }
  }));

export interface UserDevicesStoreInterface extends Instance<typeof UserDevicesStore> {}

export {UserDevicesStore};
