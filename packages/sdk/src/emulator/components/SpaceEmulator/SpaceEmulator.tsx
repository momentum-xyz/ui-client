import React, {FC, useState} from 'react';
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

  const [isExpanded, setIsExpanded] = useState(false);

  console.log('RENDER SpaceEmulator', {plugin, objectId});

  return (
    <styled.SpaceLayout>
      <styled.SpaceTabContainer>
        <styled.SpaceContent className={isExpanded ? 'expanded' : undefined}>
          <SpaceTabEmulator
            plugin={plugin}
            objectId={objectId!}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </styled.SpaceContent>
      </styled.SpaceTabContainer>
    </styled.SpaceLayout>
  );
};
