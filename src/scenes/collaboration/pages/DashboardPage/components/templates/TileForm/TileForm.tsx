import React, {FC, useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {Dialog, Dropdown, Heading} from 'ui-kit';
import {TileTypeEnum} from 'core/enums';
import {TILES_DROPDOWN_OPTIONS} from 'core/constants';

import {ImageTileForm, TextTileForm, VideoTileForm} from './components';
import * as styled from './TileForm.styled';

const TileForm: FC = () => {
  const theme = useTheme();
  const {collaborationStore} = useStore();
  const {dashboardStore, spaceStore} = collaborationStore;
  const {tileDialog, tileFormStore, dashboard} = dashboardStore;
  const {currentTile, tileCreateRequest, tileUpdateRequest, imageUploadRequest} = tileFormStore;

  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

  useEffect(() => {
    setSelectedType(currentTile?.type ?? '');
  }, [currentTile]);

  useEffect(() => {
    return () => tileFormStore.resetModel();
  }, []);

  useEffect(() => {
    if (tileCreateRequest.isDone || tileUpdateRequest.isDone) {
      tileDialog.close();
    }
  }, [tileCreateRequest.state, tileUpdateRequest.state]);

  return (
    <Dialog
      theme={theme}
      title={t('dashboard.tileForm.title')}
      showCloseButton
      onClose={tileDialog.close}
      hasBorder
      closeOnBackgroundClick={false}
    >
      <styled.Container>
        <styled.Div>
          <styled.DropDownContainer>
            <Heading
              type="h4"
              align="left"
              label={t('dashboard.tileForm.tileType')}
              transform="uppercase"
              isCustom
            />
            <Dropdown
              placeholder={t('dashboard.tileForm.typePlaceholder')}
              value={selectedType}
              options={TILES_DROPDOWN_OPTIONS}
              onOptionSelect={(option) => {
                setSelectedType(option.value);
              }}
              variant="secondary"
            />
          </styled.DropDownContainer>
          {selectedType === TileTypeEnum.TILE_TYPE_VIDEO && (
            <VideoTileForm
              currentTile={currentTile}
              spaceId={spaceStore.space.id ?? ''}
              onClose={tileDialog.close}
              createTile={tileFormStore.createVideoTile}
              updateTile={tileFormStore.updateVideoTile}
              fetchDashboard={dashboard.fetchDashboard}
              createRequestPending={tileCreateRequest.isPending}
              updateRequestPending={tileUpdateRequest.isPending}
            />
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_TEXT && (
            <TextTileForm
              currentTile={currentTile}
              spaceId={spaceStore.space.id ?? ''}
              onClose={tileDialog.close}
              createTile={tileFormStore.createTextTile}
              updateTile={tileFormStore.updateTextTile}
              fetchDashboard={dashboard.fetchDashboard}
              createRequestPending={tileCreateRequest.isPending}
              updateRequestPending={tileUpdateRequest.isPending}
            />
          )}
          {selectedType === TileTypeEnum.TILE_TYPE_MEDIA && (
            <ImageTileForm
              spaceId={spaceStore.space.id ?? ''}
              onClose={tileDialog.close}
              createTile={tileFormStore.createImageTile}
              updateTile={tileFormStore.updateImageTile}
              currentTile={currentTile}
              fetchDashboard={dashboard.fetchDashboard}
              createRequestPending={tileCreateRequest.isPending}
              updateRequestPending={tileUpdateRequest.isPending}
              uploadRequestPending={imageUploadRequest.isPending}
            />
          )}
        </styled.Div>
      </styled.Container>
    </Dialog>
  );
};

export default observer(TileForm);
