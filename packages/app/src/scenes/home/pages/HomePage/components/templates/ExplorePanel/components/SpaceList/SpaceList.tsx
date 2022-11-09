import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Heading} from '@momentum-xyz/ui-kit';

import {SpaceListItem} from 'ui-kit';
import {SpaceListByCategoryModelInterface} from 'scenes/home/stores/HomeStore/models';

import * as styled from './SpaceList.styled';

interface PropsInterface {
  spaceListByCategory: SpaceListByCategoryModelInterface[];
  onTeleportToSpace: (spaceId: string) => void;
  onSelectSpace: (spaceId: string) => void;
}

const SpaceList: FC<PropsInterface> = (props) => {
  const {spaceListByCategory, onTeleportToSpace, onSelectSpace} = props;

  const {t} = useTranslation();

  return (
    <div>
      <styled.Wrapper>
        <Heading label={t('labels.searchResults')} type="h1" align="left" transform="uppercase" />
      </styled.Wrapper>

      <styled.Container data-testid="SpacesList-test">
        {spaceListByCategory?.map(({name, spaceList}) => (
          <styled.Category key={name}>
            <styled.CategoryName label={name} type="h4" align="left" />
            {spaceList.map((spaceInfo) => (
              <SpaceListItem
                key={spaceInfo.id}
                spaceInfo={spaceInfo}
                // TODO: Not implemented yet
                isFavorite={false}
                onTeleportToSpace={onTeleportToSpace}
                onSelectSpace={onSelectSpace}
              />
            ))}
          </styled.Category>
        ))}
      </styled.Container>
    </div>
  );
};

export default observer(SpaceList);
