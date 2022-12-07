export const glCanvasWrapper = document.getElementById('wrapper');
export const glCanvas = document.getElementById('renderer');
export const gl = glCanvas.getContext('webgl2', {
  stencil: false,
  antialias: true,
  desynchronized: false,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: true,
  premultipliedAlpha: false,
  alpha: false
});
