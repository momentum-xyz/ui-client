import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Frame, Button, Input} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {SkyboxItemModelType} from 'core/models';

import {SkyboxList, UploadSkybox, SkyboxPreview, CustomSkyboxWithAI} from './components';
import * as styled from './SkyboxSelector.styled';

const SkyboxSelector: FC = () => {
  const {widgetStore, sessionStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {skyboxSelectorStore} = creatorStore;
  const {worldId} = universeStore;
  const {userId} = sessionStore;

  const [previewSkybox, setPreviewSkybox] = useState<SkyboxItemModelType | null>(null);
  const [skyboxPreviewType, setSkyboxPreviewType] = useState<'COMMUNITY' | 'PRIVATE'>('COMMUNITY');
  const [mode, setMode] = useState<'view' | 'upload' | 'gen_ai'>('view');
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const isCommunityShown = skyboxPreviewType === 'COMMUNITY';

  const {t} = useI18n();

  useEffect(() => {
    skyboxSelectorStore.fetchItems(worldId, userId);

    return () => {
      skyboxSelectorStore.resetModel();
    };
  }, [worldId, userId, skyboxSelectorStore]);

  /*const filteredSkyboxList = useMemo(() => {
    const list = skyboxPreviewType === 'COMMUNITY' ? communitySkyboxesList : userSkyboxesList;
    return list.filter((sb) => sb.name.toLowerCase().includes(searchInputValue.toLowerCase()));
  }, [communitySkyboxesList, skyboxPreviewType, userSkyboxesList, searchInputValue]);*/

  return (
    <styled.Container data-testid="SkyboxSelector-test">
      <styled.ControlsContainer>
        <Frame>
          <styled.ControlsInnerContainer>
            <styled.SkyboxTypeContainer>
              <Button
                label={t('titles.communitySkyboxLibrary')}
                active={isCommunityShown}
                onClick={() => {
                  setPreviewSkybox(null);
                  setMode('view');
                  setSkyboxPreviewType('COMMUNITY');
                  setSearchInputValue('');
                }}
              />
              <Button
                label={t('titles.privateSkyboxLibrary')}
                active={!isCommunityShown}
                onClick={() => {
                  setPreviewSkybox(null);
                  setMode('view');
                  setSkyboxPreviewType('PRIVATE');
                  setSearchInputValue('');
                }}
              />
            </styled.SkyboxTypeContainer>
            <styled.SkyboxSearchContainer>
              <Input
                wide
                isSearch
                placeholder={
                  isCommunityShown
                    ? t('placeholders.searchCommunityLibrary')
                    : t('placeholders.searchPrivateLibrary')
                }
                value={searchInputValue}
                onChange={setSearchInputValue}
              />
            </styled.SkyboxSearchContainer>
            <Button
              label={t('actions.createCustomSkyboxAI')}
              wide
              icon="ai"
              onClick={() => {
                setMode('gen_ai');
                setPreviewSkybox(null);
              }}
            />
            <Button
              label={t('actions.uploadCustomSkybox')}
              wide
              icon="monitor_upload"
              onClick={() => {
                setMode('upload');
                setPreviewSkybox(null);
              }}
            />
          </styled.ControlsInnerContainer>
        </Frame>
        <styled.Separator />
      </styled.ControlsContainer>

      {mode === 'view' && !previewSkybox && (
        <styled.SkyboxListContainer>
          <styled.SkyboxListHeader>
            <span>
              {isCommunityShown
                ? t('titles.odysseySkyboxLibraryHeader')
                : t('titles.privateSkyboxLibraryHeader')}
            </span>
            <span>
              {isCommunityShown
                ? skyboxSelectorStore.communitySkyboxesCount
                : skyboxSelectorStore.userSkyboxes.length}
            </span>
          </styled.SkyboxListHeader>

          <SkyboxList
            skyboxGroups={
              isCommunityShown
                ? skyboxSelectorStore.communitySkyboxGroups
                : skyboxSelectorStore.userSkyboxGroups
            }
            skyboxGroupCount={
              isCommunityShown
                ? skyboxSelectorStore.communitySkyboxesGroupsCount
                : skyboxSelectorStore.userSkyboxGroups.length
            }
            isLoading={skyboxSelectorStore.isSkyboxesLoading}
            isMySkyboxes={!isCommunityShown}
            onSkyboxSelect={(sb) => setPreviewSkybox(sb)}
            onSkyboxDelete={async (skyboxId) => {
              await skyboxSelectorStore.removeUserSkybox(userId, skyboxId);
              await skyboxSelectorStore.fetchItems(worldId, userId);
            }}
            onLoadMore={(startIndex) => {
              if (isCommunityShown) {
                skyboxSelectorStore.loadMoreCommunitySkyboxes(startIndex);
              }
            }}
          />
        </styled.SkyboxListContainer>
      )}

      {mode === 'upload' && <UploadSkybox onBack={() => setMode('view')} />}
      {mode === 'gen_ai' && <CustomSkyboxWithAI onBack={() => setMode('view')} />}

      {mode === 'view' && previewSkybox && (
        <SkyboxPreview
          skybox={previewSkybox}
          onSkyboxSelect={(sb) => {
            skyboxSelectorStore
              .updateActiveSkybox(sb.id, worldId)
              .then(() => {
                setPreviewSkybox(null);
              })
              .catch((err) => {
                toast.error(err.message);
              });
          }}
          onBack={() => setPreviewSkybox(null)}
        />
      )}
    </styled.Container>
  );
};

export default observer(SkyboxSelector);
