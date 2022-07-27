import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {DraggableProvided} from 'react-beautiful-dnd';

import {PanelLayout, TileMenu} from 'ui-kit';
import {TileInterface} from 'core/models';
import {useStore} from 'shared/hooks';

import * as styled from './TileDetail.styled';

interface PropsInterface {
  tile: TileInterface;
  videoUrl?: string;
  imageUrl?: string;
  provided?: DraggableProvided;
  isAdmin: boolean;
  isMember: boolean;
}

const TileDetail: FC<PropsInterface> = ({
  tile,
  videoUrl,
  imageUrl,
  provided,
  isAdmin,
  isMember
}) => {
  const theme = useTheme();
  const {collaborationStore} = useStore();
  const {dashboardManager} = collaborationStore;
  const {tileRemoveDialog, tileFormStore} = dashboardManager;

  const handleEdit = () => {
    console.info('');
  };
  const handleDelete = () => {
    tileRemoveDialog.open();
    tileFormStore.setTile(tile);
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
      {(isAdmin || isMember) && (
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
