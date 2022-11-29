import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import cn from 'classnames';

import {useStore} from 'shared/hooks';
import {WorldBuilderSkyboxInterface} from 'scenes/worldBuilder/stores/WorldBuilderSkyboxesStore/models';

import {Carousel} from '../Carousel';

import * as styled from './SkyboxSelectorWithPreview.styled';

const SkyboxSelectorWithPreview: FC = () => {
  const {worldBuilderStore, mainStore} = useStore();
  const {worldBuilderSkyboxesStore} = worldBuilderStore;
  const {unityStore} = mainStore;
  const {items, selectedItem, selectItem, saveSelectedItem} = worldBuilderSkyboxesStore;

  useEffect(() => {
    worldBuilderSkyboxesStore.fetchItems();
  }, [worldBuilderSkyboxesStore]);

  return (
    <styled.Container>
      <styled.ItemsGallery>
        {!!items && !!selectedItem && (
          <Carousel<WorldBuilderSkyboxInterface>
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
                      label="Select Skybox"
                      // variant="inverted"
                      transform="normal"
                      size="medium"
                      onClick={() => {
                        saveSelectedItem().catch((err) => {
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
    </styled.Container>
  );
};

export default observer(SkyboxSelectorWithPreview);
