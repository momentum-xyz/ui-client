import {useEffect, useMemo, useRef} from 'react';

import {ObjectHelper, SkyboxHelper} from '../babylon';

interface PropsInterface {
  url?: string | null;
}

export const useSkyboxPreview = ({url}: PropsInterface) => {
  const refSkipRestoringPreviousSkybox = useRef<boolean>(false);
  const refOriginalSkyboxUrl = useRef<string | null>(SkyboxHelper.currentSkyboxUrl);
  const originalUrl = refOriginalSkyboxUrl.current;

  console.log('useSkyboxPreview', {url, refOriginalSkyboxUrl, refSkipRestoringPreviousSkybox});

  useEffect(() => {
    if (url) {
      console.log('useSkyboxPreview set360Skybox', url);
      SkyboxHelper.set360Skybox(ObjectHelper.scene, url);
    } else if (
      originalUrl &&
      SkyboxHelper.currentSkyboxUrl !== originalUrl &&
      !refSkipRestoringPreviousSkybox.current
    ) {
      console.log('useSkyboxPreview restore original', originalUrl);
      SkyboxHelper.set360Skybox(ObjectHelper.scene, originalUrl);
    }
  }, [url, originalUrl]);

  useEffect(() => {
    return () => {
      if (!refSkipRestoringPreviousSkybox.current && originalUrl) {
        console.log('useSkyboxPreview restore original on unmount', originalUrl);
        SkyboxHelper.set360Skybox(ObjectHelper.scene, originalUrl);
      } else {
        console.log('useSkyboxPreview skip restoring previous skybox on unmount');
      }
    };
  }, [originalUrl]);

  return useMemo(() => {
    const skipRestoringPreviousSkybox = () => {
      refSkipRestoringPreviousSkybox.current = true;
    };

    return {skipRestoringPreviousSkybox};
  }, []);
};
