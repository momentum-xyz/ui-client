/* eslint-disable */
// @ts-nocheck

import {glCanvas, glCanvasWrapper} from './webgl/gl.js';
import {Scene} from './scene.js';

let initialized = false;

// FIXME: KOVI
export function supernova(fps = 30) {
  if (initialized) {
    return;
  } else {
    initialized = true;
  }

  const scene = new Scene();
  const updateRate = 1 / fps;
  let lastTime = performance.now();
  let updateTime = 0;

  window.addEventListener('resize', () => {
    scene.resize(
      (glCanvas.width = glCanvasWrapper.clientWidth),
      (glCanvas.height = glCanvasWrapper.clientHeight)
    );
  });

  scene.resize(
    (glCanvas.width = glCanvasWrapper.clientWidth),
    (glCanvas.height = glCanvasWrapper.clientHeight)
  );

  window.addEventListener('mousemove', (event) => scene.mouseMove(event.clientX, event.clientY));

  const loop = (time) => {
    const elapsedTime = Math.max(10, time - lastTime);

    updateTime += 0.001 * elapsedTime;

    if (updateTime > updateRate) {
      scene.update();

      updateTime -= updateRate * Math.floor(updateTime / updateRate);
    }

    lastTime = time;

    scene.render(updateTime / updateRate, 0.001 * elapsedTime);

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);

  // FIXME: Kovi
  setTimeout(() => {
    scene.start();
  }, 2000);
}

// FIXME: Kovi
//supernova();
// changed js to ts
