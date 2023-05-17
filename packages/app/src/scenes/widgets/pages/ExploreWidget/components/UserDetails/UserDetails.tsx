import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage, WorldsOwnedList, WorldsStakedList} from 'ui-kit';
import {UserDetailsModelType} from 'core/models';

import * as styled from './UserDetails.styled';

interface PropsInterface {
  userDetails: UserDetailsModelType;
  onVisitWorld: (worldId: string) => void;
  onSelectWorld: (worldId: string) => void;
  onClose: () => void;
}

const UserDetails: FC<PropsInterface> = (props) => {
  const {userDetails, onVisitWorld, onSelectWorld, onClose} = props;
  const {user, userId, worldsOwned, worldsStakedIn} = userDetails;

  const {t} = useI18n();

  useEffect(() => {
    Universe3dEmitter.emit('UserSelected', userId);
  }, [userId]);

  return (
    <styled.Container data-testid="UserDetails-test">
      <Panel
        isFullHeight
        size="normal"
        icon="astronaut"
        variant="primary"
        image={getImageAbsoluteUrl(user?.profile.avatarHash, ImageSizeEnum.S3)}
        title={t('labels.memberProfile')}
        onClose={onClose}
      >
        <styled.Wrapper>
          <ProfileImage
            name={user?.name || user?.id || ''}
            image={user?.profile.avatarHash}
            imageErrorIcon="astronaut"
          />

          <styled.GeneralScrollable>
            <ProfileInfo
              hash={user?.wallet}
              description={user?.profile.bio}
              weblink={user?.profile.profileLink}
              joinDate={user?.createdAt}
            />

            <WorldsOwnedList
              worldsOwned={worldsOwned}
              onSelectWorld={onSelectWorld}
              onVisitWorld={onVisitWorld}
            />

            <WorldsStakedList
              worldsStakedIn={worldsStakedIn}
              onSelectWorld={onSelectWorld}
              onVisitWorld={onVisitWorld}
            />
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(UserDetails);
