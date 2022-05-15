import React, {useEffect, useState} from 'react';

import {youtubeVideoPath} from 'core/utils';

import {useDashboard} from '../../../hooks/api/useDashboardService';
import Button from '../Button';

export interface DashboardVideoProps {
  dashboardId: string;
  onClose: (shouldOpenDashboard: boolean) => void;
}

const DashboardVideo: React.FC<DashboardVideoProps> = ({dashboardId, onClose}) => {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [dashboard] = useDashboard(dashboardId);

  useEffect(() => {
    //get video
    if (dashboard) {
      const videoItem = dashboard?.tiles.find((item) => item.permanentType === 'video');
      if (videoItem) {
        setVideoURL(videoItem?.content?.url);
      } else {
        if (onClose) {onClose(true);}
      }
    }
  }, [dashboard]);

  const closeVideo = () => {
    setVideoURL(null);
    if (onClose) {onClose(false);}
  };

  if (videoURL)
    {return (
      <>
        <div className="fixed z-pop-over shadow-black bg-dark-blue-90 transition-all transform w-3/4 bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 max-h-[80vh]">
          <div>
            <div className="responsive-video">
              <iframe
                title="Livestream"
                /* @ts-ignore */
                src={`https://www.youtube.com/embed/${youtubeVideoPath(videoURL, 'id')}?autoplay=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <div className="fixed flex -top-3 right-0">
                <Button type="primary" size="s" onClick={closeVideo}>
                  x
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );}
  else {return null;}
};

export default DashboardVideo;
