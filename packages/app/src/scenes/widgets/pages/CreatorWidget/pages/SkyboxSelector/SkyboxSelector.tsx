import {FC, useEffect, useMemo, useState} from 'react';
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
  const {communitySkyboxesList, userSkyboxesList} = skyboxSelectorStore;
  const {worldId} = universeStore;
  const {userId} = sessionStore;

  const {t} = useI18n();

  const [previewSkybox, setPreviewSkybox] = useState<SkyboxItemModelType | null>(null);
  const [skyboxPreviewType, setSkyboxPreviewType] = useState<'COMMUNITY' | 'PRIVATE'>('COMMUNITY');
  const [mode, setMode] = useState<'view' | 'upload' | 'gen_ai'>('view');
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  useEffect(() => {
    skyboxSelectorStore.fetchItems(worldId, userId);
  }, [skyboxSelectorStore, userId, worldId]);

  const filteredSkyboxList = useMemo(() => {
    const list = skyboxPreviewType === 'COMMUNITY' ? communitySkyboxesList : userSkyboxesList;
    return list.filter((sb) => sb.name.toLowerCase().includes(searchInputValue.toLowerCase()));
  }, [communitySkyboxesList, skyboxPreviewType, userSkyboxesList, searchInputValue]);

  return (
    <styled.Container data-testid="SkyboxSelector-test">
      <styled.ControlsContainer>
        <Frame>
          <styled.ControlsInnerContainer>
            <styled.SkyboxTypeContainer>
              <Button
                label={t('titles.communitySkyboxLibrary')}
                active={skyboxPreviewType === 'COMMUNITY'}
                onClick={() => {
                  setPreviewSkybox(null);
                  setMode('view');
                  setSkyboxPreviewType('COMMUNITY');
                  setSearchInputValue('');
                }}
              />
              <Button
                label={t('titles.privateSkyboxLibrary')}
                active={skyboxPreviewType === 'PRIVATE'}
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
                placeholder={t(
                  `placeholders.${
                    skyboxPreviewType === 'COMMUNITY'
                      ? 'searchCommunityLibrary'
                      : 'searchPrivateLibrary'
                  }`
                )}
                value={searchInputValue}
                isSearch
                onChange={setSearchInputValue}
                wide
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
              {t(
                `titles.${
                  skyboxPreviewType === 'COMMUNITY'
                    ? 'odysseySkyboxLibraryHeader'
                    : 'privateSkyboxLibraryHeader'
                }`
              )}
            </span>
            <span>
              {skyboxPreviewType === 'COMMUNITY'
                ? communitySkyboxesList.length
                : userSkyboxesList.length}
            </span>
          </styled.SkyboxListHeader>
          <SkyboxList
            skyboxes={filteredSkyboxList}
            isMySkyboxes={skyboxPreviewType === 'PRIVATE'}
            onSkyboxSelect={(sb) => setPreviewSkybox(sb)}
            onSkyboxDelete={async (skyboxId) => {
              await skyboxSelectorStore.removeUserSkybox(userId, skyboxId);
              await skyboxSelectorStore.fetchUserSkyboxes(userId);
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
