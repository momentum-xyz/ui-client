import React from 'react';

import {youtubeVideoPath} from 'core/utils';

import Panel from '../Panel';

export interface VideoTileProps {
  id: string;
  url: string;
}

const VideoTile: React.FC<VideoTileProps> = React.memo(({url, id, children}) => (
  <Panel padding={false} grow={false} className="group mb-1 relative">
    <div className="video-panel">
      <iframe
        title={`video-${id}`}
        src={`https://www.youtube.com/embed/${youtubeVideoPath(url, id)}`}
        allowFullScreen
      />
      {children}
    </div>
  </Panel>
));

export default VideoTile;
