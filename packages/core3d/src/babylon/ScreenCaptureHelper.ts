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
      fetch(data).then((base64Response) => {
        base64Response.blob().then((blobResponse) => {
          const screenshotFile = new File([blobResponse], 'screenshot.png', {type: 'image/png'});
          this.onScreen(screenshotFile);
        });
      });
    });
  }

  static recordVideo(duration: number) {
    if (VideoRecorder.IsSupported(this.scene.getEngine()) && !this.videoRecorder.isRecording) {
      this.videoRecorder.startRecording(null, duration).then((videoBlob) => {
        const videoFile = new File([videoBlob], 'video.webm', {type: 'video/webm'});
        this.onVideo(videoFile);
      });
    }
  }

  static stopRecordVideo() {
    if (VideoRecorder.IsSupported(this.scene.getEngine()) && this.videoRecorder.isRecording) {
      this.videoRecorder.stopRecording();
    }
  }
}
