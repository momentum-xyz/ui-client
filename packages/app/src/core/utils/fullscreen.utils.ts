export const switchFullscreen = () => {
  const doc = document.documentElement;
  if (!document.fullscreenElement && doc.requestFullscreen) {
    doc.requestFullscreen();
  } else if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};
