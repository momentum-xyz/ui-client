import React from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import {ROUTES} from 'core/constants';
import {SpacesList} from 'scenes/default/pages/HomePage/components';
import {useStore} from 'shared/hooks';
import {Heading, Text, Button} from 'ui-kit';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';

import * as styled from './SelectedSpace.styled';

const SelectedSpace: React.FC = () => {
  const {
    defaultStore: {homeStore},
    mainStore: {unityStore}
  } = useStore();
  const {exploreStore} = homeStore;
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  const {t} = useTranslation();

  const {selectedSpace} = exploreStore;

  const handleFlyToSpace = () => {
    if (!selectedSpace?.id) {
      return;
    }

    unityStore.teleportToSpace(selectedSpace.id);
    history.push(ROUTES.base);

    if (process.env.NODE_ENV === 'development' && selectedSpace) {
      joinMeetingSpace(selectedSpace.id);
    }
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
