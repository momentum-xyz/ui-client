import React from 'react';

import {useImageBase64Cache} from '../../../hooks/useImageBase64Cache';
import Panel from '../Panel';

export interface ImageTileProps {
  id: string;
  url: string;
}

const ImageTile: React.FC<ImageTileProps> = React.memo(({url, children}) => {
  const cachedUrl = useImageBase64Cache(url);
  return (
    <Panel padding={false} grow={false} className="group relative mb-1">
      <img src={cachedUrl} alt="" />
      {children}
    </Panel>
  );
});

export default ImageTile;
