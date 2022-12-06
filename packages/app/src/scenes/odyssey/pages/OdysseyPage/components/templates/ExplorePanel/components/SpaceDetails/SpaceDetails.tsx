import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Heading, Text, Button} from '@momentum-xyz/ui-kit';

import {SpaceListItem} from 'ui-kit';
import {SpaceInfoModelInterface} from 'core/models';
import {SpaceDetailsModelInterface} from 'scenes/odyssey/stores/OdysseyStore/models';

import * as styled from './SpaceDetails.styled';

interface PropsInterface {
  isWorld: boolean;
  space: SpaceDetailsModelInterface;
  previousSpace: SpaceInfoModelInterface | null;
  onTeleportToSpace: (spaceId: string) => void;
  onSelectSpace: (spaceId: string) => void;
  onGoBack: () => void;
}

const SpaceDetails: FC<PropsInterface> = (props) => {
  const {isWorld, space, previousSpace, onSelectSpace, onTeleportToSpace, onGoBack} = props;
  const {id, name, description, subSpaces} = space;

  const {t} = useTranslation();

  const handleFlyToSpace = () => {
    onTeleportToSpace(id);
  };

  return (
    <styled.Container data-testid="SpaceDetails-test">
      {!!previousSpace && (
        <styled.Header onClick={onGoBack}>
          <styled.BackIconSvg name="chevron" />
          <styled.ParentHeading type="h3" label={previousSpace.name} align="left" />
        </styled.Header>
      )}

      <styled.Details>
        <Heading label={name} type="h2" align="left" transform="uppercase" />
        <Text text={description} size="s" />

        {!isWorld && (
          <styled.FlyToButtonContainer>
            <Button icon="rocket" onClick={handleFlyToSpace} label={t('actions.flyToThisSpace')} />
          </styled.FlyToButtonContainer>
        )}
      </styled.Details>

      {subSpaces.length !== 0 && (
        <styled.SubspacesContainer>
          {!isWorld && (
            <styled.SubSpacesHeading type="h4" label={`${t('labels.subspaces')}:`} align="left" />
          )}
          <styled.SubspaceList>
            {subSpaces.map((spaceInfo) => (
              <SpaceListItem
                key={spaceInfo.id}
                spaceInfo={spaceInfo}
                // TODO: Not implemented yet
                isFavorite={false}
                onTeleportToSpace={onTeleportToSpace}
                onSelectSpace={onSelectSpace}
              />
            ))}
          </styled.SubspaceList>
        </styled.SubspacesContainer>
      )}
    </styled.Container>
  );
};

export default observer(SpaceDetails);
