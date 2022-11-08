import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';
import {Heading, Text, Button} from '@momentum-xyz/ui-kit';

import {SpaceListItem} from 'ui-kit';
import {SpaceInfoModelInterface} from 'core/models';
import {SpaceDetailsModelInterface} from 'scenes/home/stores/HomeStore/models';

import * as styled from './SpaceDetails.styled';

interface PropsInterface {
  isWorld: boolean;
  space: SpaceDetailsModelInterface;
  previousSpace: SpaceInfoModelInterface | null;
  teleportToSpace: (spaceId: string) => void;
  selectSpace: (spaceId: string) => void;
  goBack: () => void;
}

const SpaceDetails: FC<PropsInterface> = (props) => {
  const {isWorld, space, previousSpace, selectSpace, teleportToSpace, goBack} = props;

  const {t} = useTranslation();

  const handleFlyToSpace = () => {
    teleportToSpace(space.id);
  };

  return (
    <styled.Container data-testid="SelectedSpace-test">
      {!!previousSpace && (
        <styled.Header onClick={goBack}>
          <styled.BackIconSvg name="chevron" />
          <styled.ParentHeading type="h3" label={previousSpace.name} align="left" />
        </styled.Header>
      )}

      <styled.Details className={cn({empty: space.subSpaces.length === 0})}>
        <Heading label={space.name ?? ''} type="h2" align="left" transform="uppercase" />
        <Text text={space.description} size="s" />

        {!isWorld && (
          <styled.FlyToButtonContainer>
            <Button icon="rocket" onClick={handleFlyToSpace} label={t('actions.flyToThisSpace')} />
          </styled.FlyToButtonContainer>
        )}
      </styled.Details>

      {space.subSpaces.length !== 0 && (
        <styled.SubspacesContainer>
          {!isWorld && (
            <styled.SubSpacesHeading type="h4" label={`${t('labels.subspaces')}:`} align="left" />
          )}
          {space.subSpaces.map((spaceInfo) => (
            <SpaceListItem
              key={space.id}
              spaceInfo={spaceInfo}
              // TODO: Not implemented yet
              isFavorite={false}
              teleportToSpace={teleportToSpace}
              selectSpace={selectSpace}
            />
          ))}
          ;
        </styled.SubspacesContainer>
      )}
    </styled.Container>
  );
};

export default observer(SpaceDetails);
