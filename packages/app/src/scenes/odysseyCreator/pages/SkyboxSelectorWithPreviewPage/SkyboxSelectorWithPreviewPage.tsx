import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Text, IconSvg} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {useParams, useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {Asset3dInterface} from 'core/models';

import {Carousel, UploadSkyboxDialog} from './components';
import * as styled from './SkyboxSelectorWithPreviewPage.styled';

const SkyboxSelectorWithPreviewPage: FC = () => {
  const {odysseyCreatorStore, unityStore, sessionStore} = useStore();
  const {skyboxSelectorStore} = odysseyCreatorStore;
  const {selectedItem, currentItem, selectItem, saveItem, allSkyboxes, removeUserSkybox} =
    skyboxSelectorStore;
  const {unityInstanceStore} = unityStore;
  const {user} = sessionStore;

  const {worldId} = useParams<{worldId: string}>();

  const history = useHistory();

  const {t} = useTranslation();

  useEffect(() => {
    skyboxSelectorStore.fetchItems(worldId);
  }, [skyboxSelectorStore, worldId]);

  return (
    <styled.Container>
      <styled.ItemsGallery>
        <styled.SkyboxCountContainer>
          <styled.SkyboxCount>
            <Text text={t('counts.skyboxes', {count: allSkyboxes.length})} size="l" align="left" />
          </styled.SkyboxCount>
        </styled.SkyboxCountContainer>
        {!!allSkyboxes && !!selectedItem && (
          <Carousel<Asset3dInterface>
            items={allSkyboxes}
            activeItem={selectedItem}
            onChange={selectItem}
            renderItem={(item, idx) => {
              const active = item === selectedItem;
              return (
                <styled.Item
                  className={cn({active})}
                  key={item.id + `-${idx}`}
                  onClick={() => {
                    selectItem(item);
                    unityInstanceStore.changeSkybox(item.id);
                  }}
                >
                  {item.isUserAttribute && (
                    <styled.DeleteButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        removeUserSkybox(worldId, item.id).catch((err) => {
                          toast.error(err.message);
                        });
                      }}
                    >
                      <IconSvg name="bin" size="normal" isWhite />
                    </styled.DeleteButton>
                  )}
                  <styled.PreviewImg src={item.image} />
                  <styled.ItemTitle>{item.name}</styled.ItemTitle>
                  <styled.ItemCreatedBy>
                    By <span>{item.isUserAttribute ? user?.name : 'Odyssey'}</span>
                  </styled.ItemCreatedBy>
                  <styled.ItemButtonHolder>
                    <Button
                      label={
                        currentItem === item
                          ? t('titles.selectedSkybox')
                          : t('actions.selectSkybox')
                      }
                      // variant="inverted"
                      disabled={currentItem === item}
                      transform="uppercase"
                      size="medium"
                      onClick={() => {
                        saveItem(item, worldId).catch((err) => {
                          toast.error(err.message);
                        });
                      }}
                    />
                  </styled.ItemButtonHolder>
                </styled.Item>
              );
            }}
          />
        )}
      </styled.ItemsGallery>
      <styled.ButtonsHolder>
        <Button label="Add Skybox" onClick={skyboxSelectorStore.uploadDialog.toggle} />
        <Button label={t('actions.closePanel')} onClick={() => history.goBack()} />
      </styled.ButtonsHolder>
      {skyboxSelectorStore.uploadDialog.isOpen && <UploadSkyboxDialog />}
    </styled.Container>
  );
};

export default observer(SkyboxSelectorWithPreviewPage);
