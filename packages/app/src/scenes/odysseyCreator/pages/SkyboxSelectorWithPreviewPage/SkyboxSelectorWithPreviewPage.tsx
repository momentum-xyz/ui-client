import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {useParams, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {Asset3dInterface} from 'core/models';

import {Carousel} from './components';
import * as styled from './SkyboxSelectorWithPreviewPage.styled';

const SkyboxSelectorWithPreviewPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {skyboxSelectorStore} = odysseyCreatorStore;
  const {items, selectedItem, currentItem, selectItem, saveItem} = skyboxSelectorStore;
  const {unityInstanceStore} = unityStore;

  const {worldId} = useParams<{worldId: string}>();

  const navigate = useNavigate();

  const {t} = useTranslation();

  useEffect(() => {
    skyboxSelectorStore.fetchItems(worldId);
  }, [skyboxSelectorStore, worldId]);

  return (
    <styled.Container>
      <styled.ItemsGallery>
        <styled.SkyboxCountContainer>
          <styled.SkyboxCount>
            <Text text={t('counts.skyboxes', {count: items.length})} size="l" align="left" />
          </styled.SkyboxCount>
        </styled.SkyboxCountContainer>
        {!!items && !!selectedItem && (
          <Carousel<Asset3dInterface>
            items={items}
            activeItem={selectedItem}
            onChange={selectItem}
            renderItem={(item, idx) => {
              const active = item === selectedItem;
              return (
                <styled.Item
                  className={cn({active})}
                  key={item.id + idx}
                  onClick={() => {
                    selectItem(item);
                    unityInstanceStore.changeSkybox(item.id);
                  }}
                >
                  <styled.PreviewImg src={item.image} />
                  <styled.ItemTitle>{item.name}</styled.ItemTitle>
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
      <styled.CloseButton label={t('actions.closePanel')} onClick={() => navigate(-1)} />
    </styled.Container>
  );
};

export default observer(SkyboxSelectorWithPreviewPage);
