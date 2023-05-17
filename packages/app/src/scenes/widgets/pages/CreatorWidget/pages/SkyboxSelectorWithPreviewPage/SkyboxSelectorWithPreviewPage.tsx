import {FC, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, Button, Input} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {Asset3dInterface} from 'core/models';

import {UploadSkybox, SkyboxList, SkyboxPreview, DeleteSkyboxDialog} from './components';
import * as styled from './SkyboxSelectorWithPreviewPage.styled';

const SkyboxSelectorWithPreviewPage: FC = () => {
  const {widgetStore, sessionStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {skyboxSelectorStore} = creatorStore;
  const {
    saveItem,

    communitySkyboxesList,
    userSkyboxesList
  } = skyboxSelectorStore;
  const {user} = sessionStore;
  const {worldId} = universeStore;

  const {t} = useI18n();

  const [previewSkybox, setPreviewSkybox] = useState<Asset3dInterface | null>(null);
  const [skyboxPreviewType, setSkyboxPreviewType] = useState<'COMMUNITY' | 'PRIVATE'>('COMMUNITY');
  const [isUploadingSkybox, setIsUploadingSkybox] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  useEffect(() => {
    if (!user) {
      return;
    }
    skyboxSelectorStore.fetchItems(worldId, user.id);
  }, [skyboxSelectorStore, user, worldId]);

  const filteredSkyboxList = useMemo(() => {
    const list = skyboxPreviewType === 'COMMUNITY' ? communitySkyboxesList : userSkyboxesList;
    return list.filter((sb) => sb.name.toLowerCase().includes(searchInputValue.toLowerCase()));
  }, [communitySkyboxesList, skyboxPreviewType, userSkyboxesList, searchInputValue]);

  return (
    <>
      <styled.Container>
        <styled.ControlsContainer>
          <Frame>
            <styled.ControlsInnerContainer>
              <styled.SkyboxTypeContainer>
                <Button
                  label={t('titles.communitySkyboxLibrary')}
                  active={skyboxPreviewType === 'COMMUNITY'}
                  onClick={() => {
                    setPreviewSkybox(null);
                    setIsUploadingSkybox(false);
                    setSkyboxPreviewType('COMMUNITY');
                    setSearchInputValue('');
                  }}
                />
                <Button
                  label={t('titles.privateSkyboxLibrary')}
                  active={skyboxPreviewType === 'PRIVATE'}
                  onClick={() => {
                    setPreviewSkybox(null);
                    setIsUploadingSkybox(false);
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
                label={t('actions.uploadCustomSkybox')}
                wide
                icon="astronaut"
                onClick={() => {
                  setIsUploadingSkybox(true);
                  setPreviewSkybox(null);
                }}
              />
            </styled.ControlsInnerContainer>
          </Frame>
          <styled.Separator />
        </styled.ControlsContainer>
      </styled.Container>

      {isUploadingSkybox && <UploadSkybox onBack={() => setIsUploadingSkybox(false)} />}
      {!isUploadingSkybox && !previewSkybox && (
        <>
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
              {
                (skyboxPreviewType === 'COMMUNITY' ? communitySkyboxesList : userSkyboxesList)
                  .length
              }
            </span>
          </styled.SkyboxListHeader>
          <SkyboxList skyboxes={filteredSkyboxList} onSkyboxSelect={(sb) => setPreviewSkybox(sb)} />
        </>
      )}
      {!isUploadingSkybox && previewSkybox && (
        <SkyboxPreview
          skybox={previewSkybox}
          onSkyboxSelect={(sb) => {
            saveItem(sb.id, worldId)
              .then(() => {
                setPreviewSkybox(null);
              })
              .catch((err) => {
                toast.error(err.message);
              });
          }}
          onSkyboxDelete={(sb) => {
            skyboxSelectorStore.openSkyboxDeletion(sb.id);
            setPreviewSkybox(null);
          }}
          onBack={() => setPreviewSkybox(null)}
        />
      )}
      {skyboxSelectorStore.deleteDialog.isOpen && <DeleteSkyboxDialog />}
    </>
  );
};

export default observer(SkyboxSelectorWithPreviewPage);
