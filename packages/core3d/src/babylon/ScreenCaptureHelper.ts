import {Scene, Tools, VideoRecorder} from '@babylonjs/core';

import {PlayerHelper} from './PlayerHelper';

export class ScreenCaptureHelper {
  static scene: Scene;

  static initialize(scene: Scene): void {
    this.scene = scene;
  }

  static takeScreenshot(size: number) {
    Tools.CreateScreenshot(this.scene.getEngine(), PlayerHelper.camera, size, (data) => {
      // Do something with image data
      //const imageBlob = new Blob([data]);
    });
  }

  static recordVideo(duration: number) {
    if (VideoRecorder.IsSupported(this.scene.getEngine())) {
      const recorder = new VideoRecorder(this.scene.getEngine());
      recorder.startRecording(null, duration).then((videoBlob) => {
        // Do Something with the videoBlob.
      });
    }
  }
}
