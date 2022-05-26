import React from 'react';

import Panel from '../Panel';
import Button from '../Button';
import posterBG from '../../../images/poster-bg.png';
import memeBG from '../../../images/meme-bg.png';
import {PermanentType} from '../../../hooks/api/useDashboardService';

export interface NonEditTileProps {
  id: string;
  permanentType: string;
  editTile?: (id: string) => void;
  // url: string;
}

const NonEditTile: React.FC<NonEditTileProps> = React.memo(
  ({id, permanentType, editTile, children}) => {
    // const cachedUrl = useImageBase64Cache(url);
    return (
      <Panel
        padding={true}
        grow={false}
        className="group relative mb-1 border border-prime-blue-100"
      >
        {/*<img src={cachedUrl} alt="" />*/}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              permanentType === PermanentType.POSTER ? `url(${posterBG})` : `url(${memeBG})`
          }}
        ></div>

        <div className="text-center space-y-4 p-4">
          <h3 className="flex-grow font-bold uppercase text-base ">UPLOAD YOUR {permanentType}</h3>
          <div className="flex items-center justify-center">
            <Button type="primary" onClick={() => editTile?.(id)}>
              Choose Image
            </Button>
          </div>
          <p>
            {permanentType === PermanentType.POSTER
              ? 'Publish a cool poster for your space!'
              : 'Add some memeing to your space!'}
          </p>
        </div>

        {children}
      </Panel>
    );
  }
);

export default NonEditTile;
