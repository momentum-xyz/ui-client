import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {DraggableProvided} from 'react-beautiful-dnd';

import {linkify} from 'core/utils';
import {PanelLayout} from 'ui-kit';
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
  const {dashboardStore} = collaborationStore;
  const {tileRemoveDialog, tileFormStore, tileDialog} = dashboardStore;

  const handleEdit = () => {
    tileDialog.open();
    tileFormStore.setTile(tile);
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
      isTruncateHeader
      headerType="h3"
      headerIconName="questions"
      headerHeadingAlign="left"
      showIcon={!!tile.content?.text}
    >
      <styled.Container>
        {imageUrl && <styled.ImageWrapper src={imageUrl} alt="" />}
        {tile.content?.text && (
          <styled.TextTile dangerouslySetInnerHTML={{__html: linkify(tile.content.text)}} />
        )}
        {videoUrl && (
          <styled.VideoWrapper>
            <iframe title={`video-${tile.id}`} src={videoUrl} allowFullScreen />
          </styled.VideoWrapper>
        )}
        {(isAdmin || isMember) && (
          <styled.MenuWrapper>
            <styled.PositionedTileMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              provided={provided}
              isDelete={tile.permanentType === null}
            />
          </styled.MenuWrapper>
        )}
      </styled.Container>
    </PanelLayout>
  );
};

export default observer(TileDetail);
