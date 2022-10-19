import {Button, Heading, IconSvg, Text} from '@momentum-xyz/ui-kit';
import {FC, useState} from 'react';
import cn from 'classnames';

import * as styled from './SkyboxSelectorWithPreview.styled';

const skyboxes = [
  {
    id: '1',
    name: 'Skybox 1',
    url: 'https://dev.odyssey.ninja/api/v3/render/get/765f5151d69276d61044a24a2867b398'
  },
  {
    id: '2',
    name: 'Skybox 2',
    url: 'https://dev.odyssey.ninja/api/v3/render/get/8af43f9895d7a50683818feef7bc34ab'
  },
  {
    id: '3',
    name: 'Skybox 3',
    url: 'https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222'
  }
];

export const SkyboxSelectorWithPreview: FC = () => {
  const [selectedId = skyboxes[0].id, setSelectedId] = useState<string | undefined>();
  const selectedItem = skyboxes.find((item) => item.id === selectedId) || skyboxes[0];

  return (
    <styled.Container>
      <styled.SideNav>
        <styled.SideBarTitleHolder>
          <Heading label="Skyboxes" type="h1" align="left" transform="uppercase" />
        </styled.SideBarTitleHolder>
        <styled.SideBarElementHolder>
          <Text text="Select the Skybox for your world" size="s" align="left" />
        </styled.SideBarElementHolder>
        {skyboxes.map((skybox) => {
          const active = skybox.id === selectedId;
          return (
            <styled.SideNavItem
              className={cn({active})}
              key={skybox.id}
              onClick={() => setSelectedId(skybox.id)}
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
        <styled.PreviewTitleHolder>
          <Text text="Skybox Preview" size="l" transform="uppercase" weight="light" />
        </styled.PreviewTitleHolder>
        <styled.PreviewImg src={selectedItem.url} />
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
      </styled.PreviewContainer>
    </styled.Container>
  );
};
