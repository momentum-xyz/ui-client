import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {useParams, useHistory} from 'react-router-dom';
import {Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {Asset3dInterface} from 'core/models';

import {Carousel} from '../Carousel';

import * as styled from './SkyboxSelectorWithPreview.styled';

const SkyboxSelectorWithPreview: FC = () => {
  const {worldBuilderStore, mainStore} = useStore();
  const {worldBuilderSkyboxesStore} = worldBuilderStore;
  const {unityStore} = mainStore;
  const {items, selectedItem, currentItem, selectItem, saveItem} = worldBuilderSkyboxesStore;

  const {worldId} = useParams<{worldId: string}>();

  const history = useHistory();

  useEffect(() => {
    worldBuilderSkyboxesStore.fetchItems(worldId);
  }, [worldBuilderSkyboxesStore, worldId]);

  return (
    <styled.Container>
      <styled.ItemsGallery>
        <styled.SkyboxCountContainer>
          <styled.SkyboxCount>
            <Text text={`${items.length} Skyboxes`} size="l" align="left" />
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
                    unityStore.changeSkybox(item.id);
                  }}
                >
                  <styled.PreviewImg src={item.image} />
                  <styled.ItemTitle>{item.name}</styled.ItemTitle>
                  <styled.ItemButtonHolder>
                    <Button
                      label={currentItem === item ? 'Selected Skybox' : 'Select Skybox'}
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
      <styled.CloseButton label="Close Panel" onClick={() => history.goBack()} />
    </styled.Container>
  );
};

export default observer(SkyboxSelectorWithPreview);
