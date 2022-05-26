import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {Heading} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {UserInitiativeItem} from '../UserInitiativeItem';

import * as styled from './UserInitiativesList.styled';

const SocialUserInitiatives: React.FC = () => {
  const {profileStore} = useStore().widgetStore;
  const {t} = useTranslation();

  useEffect(() => {
    profileStore.fetchUserInitiatives();
  }, [profileStore]);

  return (
    <styled.Container>
      <Heading type="h4" label={`${t('labels.initiatives')}:`} align="left" />
      <styled.Body>
        {profileStore.userInitiatives.length === 0 ? (
          <styled.Placeholder text="-" size="s" align="left" />
        ) : (
          <styled.ListContainer>
            {profileStore.userInitiatives.map(
              (space) =>
                space.id &&
                space.name && (
                  <UserInitiativeItem key={space.id} spaceId={space.id} spaceName={space.name} />
                )
            )}
          </styled.ListContainer>
        )}
      </styled.Body>
    </styled.Container>
  );
};

export default SocialUserInitiatives;
