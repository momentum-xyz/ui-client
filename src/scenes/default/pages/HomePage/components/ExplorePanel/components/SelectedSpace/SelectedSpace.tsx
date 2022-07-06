import React from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {Heading, Text, Button} from 'ui-kit';

import {SpacesList} from '../SpacesList';

import * as styled from './SelectedSpace.styled';

const SelectedSpace: React.FC = () => {
  const {
    defaultStore: {homeStore},
    mainStore: {unityStore}
  } = useStore();
  const {exploreStore} = homeStore;
  const history = useHistory();

  const {t} = useTranslation();

  const {selectedSpace} = exploreStore;

  const handleFlyToSpace = () => {
    if (!selectedSpace?.id) {
      return;
    }

    unityStore.teleportToSpace(selectedSpace.id);
    history.push(ROUTES.base);
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
