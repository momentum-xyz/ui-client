import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Heading, IconSvg, Text} from '@momentum-xyz/ui-kit';
import cn from 'classnames';

import {useStore} from 'shared/hooks';

import * as styled from './SkyboxSelectorWithPreview.styled';

const SkyboxSelectorWithPreview: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderSkyboxesStore} = worldBuilderStore;
  const {items, selectedItem, selectItem} = worldBuilderSkyboxesStore;

  useEffect(() => {
    worldBuilderSkyboxesStore.fetchItems();
  }, [worldBuilderSkyboxesStore]);

  return (
    <styled.Container>
      <styled.SideNav>
        <styled.SideBarTitleHolder>
          <Heading label="Skyboxes" type="h1" align="left" transform="uppercase" />
        </styled.SideBarTitleHolder>
        <styled.SideBarElementHolder>
          <Text text="Select the Skybox for your world" size="s" align="left" />
        </styled.SideBarElementHolder>
        {!!items &&
          items.map((skybox) => {
            const active = skybox === selectedItem;
            return (
              <styled.SideNavItem
                className={cn({active})}
                key={skybox.id}
                onClick={() => selectItem(skybox)}
              >
                <Text text={skybox.name} size="xl" align="left" />
                <styled.SideNavItemIcons>
                  <IconSvg name={active ? 'starOn' : 'star'} size="medium-large" />
                  <IconSvg name="arrow" size="medium-large" />
                </styled.SideNavItemIcons>
              </styled.SideNavItem>
            );
          })}
      </styled.SideNav>
      <styled.PreviewContainer>
        {!!selectedItem && (
          <>
            <styled.PreviewTitleHolder>
              <Text text="Skybox Preview" size="l" transform="uppercase" weight="light" />
            </styled.PreviewTitleHolder>
            <styled.PreviewImg src={selectedItem.image} />
            <styled.ActionButtonHolder>
              <Button
                label="Update Skybox"
                variant="inverted"
                transform="normal"
                size="medium"
                onClick={() => {
                  // TODO
                }}
              />
            </styled.ActionButtonHolder>
          </>
        )}
      </styled.PreviewContainer>
    </styled.Container>
  );
};

export default observer(SkyboxSelectorWithPreview);
