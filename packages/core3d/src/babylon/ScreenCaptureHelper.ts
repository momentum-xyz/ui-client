import ysFixWebmDuration from 'fix-webm-duration';
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

  static takeScreenshot(size: number) {
    Tools.CreateScreenshot(this.scene.getEngine(), PlayerHelper.camera, size, (data) => {
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
      const startTime = Date.now();

      this.videoRecorder.startRecording(null, duration).then((videoBlob) => {
        const duration = Date.now() - startTime;

        // FIX duration for webm type
        ysFixWebmDuration(videoBlob, duration, {logger: false}).then(function (fixedBlob) {
          const videoFile = new File([fixedBlob], 'video.webm', {type: 'video/webm'});
          ScreenCaptureHelper.onVideo(videoFile);
        });
      });
    }
  }

  static stopRecordVideo() {
    if (VideoRecorder.IsSupported(this.scene.getEngine()) && this.videoRecorder.isRecording) {
      this.videoRecorder.stopRecording();
    }
  }
}
