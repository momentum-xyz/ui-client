import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, PositionEnum, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo, WorldsOwnedList, WorldsStakedList} from 'ui-kit';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import * as styled from './UserDetailsWidget.styled';

const UserDetailsWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {userDetailsStore} = widgetStore;
  const {userDetails} = userDetailsStore;

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    if (data?.id) {
      Universe3dEmitter.emit('UserSelected', data.id.toString());
      userDetailsStore.init(data.id.toString());
    }
    return () => {
      userDetailsStore.resetModel();
    };
  }, [userDetailsStore, data?.id]);

  const onSelectWorld = (worldId: string) => {
    widgetManagerStore.open(WidgetEnum.WORLD_DETAILS, PositionEnum.LEFT, {id: worldId});
  };

  const onVisitWorld = (worldId: string) => {
    goToOdysseyHome(worldId);
  };

  if (!userDetails?.user) {
    return <></>;
  }

  const {user, worldsOwned, worldsStakedIn} = userDetails;

  return (
    <styled.Container data-testid="UserDetailsWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="astronaut"
        variant="primary"
        title={t('labels.memberProfile')}
        image={getImageAbsoluteUrl(user?.profile.avatarHash, ImageSizeEnum.S3)}
        onClose={() => widgetManagerStore.close(WidgetEnum.USER_DETAILS)}
      >
        <styled.Wrapper>
          <ProfileImage
            name={user.name || user.id}
            image={user.profile.avatarHash}
            imageErrorIcon="astronaut"
          />

          <styled.GeneralScrollable>
            <ProfileInfo
              hash={user.wallet}
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

export default observer(UserDetailsWidget);
