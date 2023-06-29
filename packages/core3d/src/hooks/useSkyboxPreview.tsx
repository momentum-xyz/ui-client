import {useEffect, useRef} from 'react';

import {ObjectHelper, SkyboxHelper} from '../babylon';

interface PropsInterface {
  url?: string | null;
  skipRestore?: boolean;
}

export const useSkyboxPreview = ({url, skipRestore}: PropsInterface) => {
  const refOriginalSkyboxUrl = useRef<string | null>(SkyboxHelper.currentSkyboxUrl);
  const originalUrl = refOriginalSkyboxUrl.current;

  useEffect(() => {
    if (url) {
      SkyboxHelper.set360Skybox(ObjectHelper.scene, url);
    } else if (originalUrl && SkyboxHelper.currentSkyboxUrl !== originalUrl) {
      SkyboxHelper.set360Skybox(ObjectHelper.scene, originalUrl);
    }
  }, [url, originalUrl]);

  useEffect(() => {
    return () => {
      if (!skipRestore && originalUrl) {
        SkyboxHelper.set360Skybox(ObjectHelper.scene, originalUrl);
      }
    };
  }, [originalUrl, skipRestore]);
};
