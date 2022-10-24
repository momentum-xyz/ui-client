import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';
import {Heading, Text, Button} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {SpacesList} from '../SpacesList';

import * as styled from './SelectedSpace.styled';

const SelectedSpace: React.FC = () => {
  const {homeStore, mainStore} = useStore();
  const {unityStore} = mainStore;
  const {exploreStore} = homeStore;
  const {selectedSpace} = exploreStore;

  const {t} = useTranslation();

  const handleFlyToSpace = () => {
    if (!selectedSpace?.id) {
      return;
    }

    unityStore.teleportToSpace(selectedSpace.id);
  };

  const handleGoBack = () => {
    exploreStore.goBack();
  };

  if (!selectedSpace) {
    return null;
  }

  return (
    <styled.Container>
      <styled.Header onClick={handleGoBack}>
        <styled.BackIconSvg name="chevron" />
        <styled.ParentHeading
          type="h3"
          label={exploreStore.previousItem?.spaceName ?? ''}
          align="left"
        />
      </styled.Header>
      <styled.Details className={cn({empty: selectedSpace?.subSpaces.length === 0})}>
        <Heading label={selectedSpace.name ?? ''} type="h2" align="left" transform="uppercase" />
        <Text text={selectedSpace?.description} size="s" />
        <styled.FlyToButtonContainer>
          <Button icon="rocket" onClick={handleFlyToSpace} label={t('actions.flyToThisSpace')} />
        </styled.FlyToButtonContainer>
      </styled.Details>
      {selectedSpace?.subSpaces.length !== 0 && (
        <styled.SubspacesContainer>
          <styled.SubSpacesHeading type="h4" label={`${t('labels.subspaces')}:`} align="left" />
          <SpacesList />
        </styled.SubspacesContainer>
      )}
    </styled.Container>
  );
};

export default observer(SelectedSpace);
