import {Scene, Tools, VideoRecorder} from '@babylonjs/core';

import {PlayerHelper} from './PlayerHelper';

export class ScreenCaptureHelper {
  static scene: Scene;
  static videoRecorder: VideoRecorder;
  static onScreen: (file: File) => void;
  static onVideo: (file: File) => void;

  static initialize(
    scene: Scene,
    onScreenshot: (file: File) => void,
    onVideo: (file: File) => void
  ): void {
    this.videoRecorder = new VideoRecorder(scene.getEngine());
    this.scene = scene;

    this.onScreen = onScreenshot;
    this.onVideo = onVideo;
  }

  static takeScreenshot() {
    Tools.CreateScreenshot(this.scene.getEngine(), PlayerHelper.camera, {precision: 1}, (data) => {
      const screenshotFile = new File([data], 'screenshot.png');
      this.onScreen(screenshotFile);
    });
  }

  static recordVideo(duration: number) {
    if (VideoRecorder.IsSupported(this.scene.getEngine()) && !this.videoRecorder.isRecording) {
      this.videoRecorder.startRecording(null, duration).then((videoBlob) => {
        const vodeoFile = new File([videoBlob], 'video.webm');
        this.onVideo(vodeoFile);
      });
    }
  }

  static stopRecordVideo() {
    if (VideoRecorder.IsSupported(this.scene.getEngine()) && this.videoRecorder.isRecording) {
      this.videoRecorder.stopRecording();
    }
  }
}
