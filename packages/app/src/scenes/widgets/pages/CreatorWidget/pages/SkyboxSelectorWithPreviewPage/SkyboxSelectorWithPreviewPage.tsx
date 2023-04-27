import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, Button, Input} from '@momentum-xyz/ui-kit-storybook';
import {toast} from 'react-toastify';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {Asset3dInterface} from 'core/models';

import {UploadSkybox, SkyboxList, SkyboxPreview, DeleteSkyboxDialog} from './components';
import * as styled from './SkyboxSelectorWithPreviewPage.styled';

const SkyboxSelectorWithPreviewPage: FC = () => {
  const {creatorStore, sessionStore, universeStore} = useStore();
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

  useEffect(() => {
    if (!user) {
      return;
    }
    skyboxSelectorStore.fetchItems(worldId, user.id);
  }, [skyboxSelectorStore, user, worldId]);

  return (
    <>
      <styled.ContainerNew>
        <styled.ControlsContainer>
          <Frame>
            <styled.ControlsInnerContainer>
              <styled.SkyboxTypeContainer>
                <Button
                  label={t('titles.communitySkyboxLibrary')}
                  onClick={() => {
                    setPreviewSkybox(null);
                    setIsUploadingSkybox(false);
                    setSkyboxPreviewType('COMMUNITY');
                  }}
                />
                <Button
                  label={t('titles.privateSkyboxLibrary')}
                  onClick={() => {
                    setPreviewSkybox(null);
                    setIsUploadingSkybox(false);
                    setSkyboxPreviewType('PRIVATE');
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
                  isSearch
                  onChange={console.log}
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
      </styled.ContainerNew>

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
          <SkyboxList
            skyboxes={skyboxPreviewType === 'COMMUNITY' ? communitySkyboxesList : userSkyboxesList}
            onSkyboxSelect={(sb) => setPreviewSkybox(sb)}
          />
        </>
      )}
      {!isUploadingSkybox && previewSkybox && (
        <SkyboxPreview
          skybox={previewSkybox}
          onSkyboxSelect={(sb) => {
            saveItem(sb.id, worldId).catch((err) => {
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
