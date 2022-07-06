import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {DraggableProvided} from 'react-beautiful-dnd';

import {PanelLayout, TileMenu} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {TileInterface} from 'core/models';

import * as styled from './TileDetail.styled';

interface PropsInterface {
  tile: TileInterface;
  videoUrl?: string;
  imageUrl?: string;
  provided?: DraggableProvided;
}

const TileDetail: FC<PropsInterface> = ({tile, videoUrl, imageUrl, provided}) => {
  const theme = useTheme();
  const {
    collaborationStore: {spaceStore}
  } = useStore();

  const handleEdit = () => {
    console.info('');
  };
  const handleDelete = () => {
    console.info('');
  };
  return (
    <PanelLayout
      theme={theme}
      title={tile.content?.title ?? ''}
      noPadding={!tile.content?.text}
      headerStyle="uppercase"
    >
      {imageUrl && <styled.ImageWrapper src={imageUrl} alt="" />}
      {tile.content?.text && <styled.TextItem text={tile.content.text} size="xs" align="left" />}
      {videoUrl && (
        <styled.VideoWrapper>
          <iframe title={`video-${tile.id}`} src={videoUrl} allowFullScreen />
        </styled.VideoWrapper>
      )}
      {(spaceStore.isAdmin || spaceStore.isMember) && (
        <TileMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          provided={provided}
          isDelete={tile.permanentType === null}
        />
      )}
    </PanelLayout>
  );
};

export default observer(TileDetail);
