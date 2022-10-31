import {FC, useState} from 'react';

import {PluginInterface} from '../../../interfaces';
import {SpaceEmulator} from '../SpaceEmulator';

import * as styled from './WorldEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
}

export const WorldEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER WorldEmulator', {plugin});
  const [isInSpace, setIsInSpace] = useState(false);
  return (
    <styled.Container>
      {isInSpace ? (
        <SpaceEmulator plugin={plugin} onClose={() => setIsInSpace(false)} />
      ) : (
        <div>
          <button onClick={() => setIsInSpace(true)}>Join Space</button>
        </div>
      )}
    </styled.Container>
  );
};
