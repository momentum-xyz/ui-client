import React, {FC} from 'react';
import {useParams} from 'react-router-dom';

import {ObjectPluginPropsInterface, PluginInterface} from '../../../interfaces';
import {SpaceTabEmulator} from '../SpaceTabEmulator';

import * as styled from './SpaceEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface<ObjectPluginPropsInterface>;
  onClose: () => void;
}

export const SpaceEmulator: FC<PropsInterface> = ({plugin, onClose}) => {
  const {objectId} = useParams<{objectId: string}>();
  console.log('RENDER SpaceEmulator', {plugin, objectId});

  return (
    <styled.SpaceLayout>
      <styled.SpaceTabContainer>
        <styled.SpaceContent>
          <SpaceTabEmulator plugin={plugin} objectId={objectId} />
        </styled.SpaceContent>
      </styled.SpaceTabContainer>
    </styled.SpaceLayout>
  );
};
