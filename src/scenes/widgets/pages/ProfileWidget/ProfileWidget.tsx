import React, {useEffect, useMemo} from 'react';
import {useHistory} from 'react-router';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {capitalize} from 'lodash-es';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {appVariables} from 'api/constants';
import {UserStatusEnum} from 'core/enums';
import {absoluteLink, monthAndYearString, withoutProtocol} from 'core/utils';
import {Button, IconSvg, SvgButton, Avatar, PanelLayout, Text} from 'ui-kit';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';

import {UserSpaceList} from './components';
import * as styled from './ProfileWidget.styled';

interface ProfileWidgetPropsInterface {
  userId: string;
  onClose: () => void;
  onEditUser?: (userId: string) => void;
  className?: string;
  hasBorder?: boolean;
  showUserInteractions?: boolean;
  showOverflow?: boolean;
}

const ProfileWidget: React.FC<ProfileWidgetPropsInterface> = ({
  userId,
  onClose,
  onEditUser,
  className,
  hasBorder,
  showOverflow,
  showUserInteractions = true
}) => {
  const {widgetStore, sessionStore, mainStore, defaultStore} = useStore();
  const {profileStore, launchInitiativeStore} = widgetStore;
  const {unityStore, worldStore} = mainStore;
  const {profile: currentUser} = sessionStore;
  const {userProfile, userSpaceList} = profileStore;
  const {homeStore} = defaultStore;
  const {exploreStore} = homeStore;

  const history = useHistory();
  const {t} = useTranslation();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();

  useEffect(() => {
    profileStore.fetchProfile(userId);
    profileStore.fetchUserSpaceList(userId);

    return () => {
      profileStore.resetModel();
    };
  }, [profileStore, userId]);

  useEffect(() => {
    profileStore.fetchUserOwnedSpaces(worldStore.worldId);
  }, [worldStore.worldId, userId]);

  const grabATable = async () => {
    const {tableId, typeUuid} = await profileStore.grabATable(worldStore.worldId, userId);
    await joinMeetingSpace(tableId, typeUuid === '285ba49f-fee3-40d2-ab55-256b5804c20c');
    onClose();
  };

  const handleFlyToUser = () => {
    if (userProfile?.uuid) {
      unityStore.teleportToUser(userProfile.uuid, history.push as (path: string) => void);
    }
  };

  const handleSelectSpace = (spaceId: string) => {
    exploreStore.selectSpace(spaceId);
  };

  const handleFlyToSpace = (spaceId: string) => {
    unityStore.teleportToSpace(spaceId);
    history.push(ROUTES.base);
  };

  const renderDate = () => {
    if (!userProfile?.createdAt) {
      return;
    }
    const date = new Date(userProfile.createdAt);
    return monthAndYearString(date);
  };

  const isItMe = useMemo(() => {
    if (!currentUser || !userProfile) {
      return false;
    }
    return currentUser.uuid === userProfile.uuid;
  }, [currentUser, userProfile]);

  return (
    <PanelLayout
      title={
        isItMe
          ? t('labels.myBio')
          : userProfile && t('labels.someonesBio', {name: userProfile.name})
      }
      captureAllPointerEvents
      headerActions={
        isItMe &&
        onEditUser && <SvgButton iconName="edit" size="normal" onClick={() => onEditUser(userId)} />
      }
      onClose={onClose}
      componentSize={{width: '430px'}}
      className={className}
      hasBorder={hasBorder}
      showOverflow={showOverflow}
    >
      <styled.Body>
        <styled.Actions>
          <Avatar
            avatarSrc={
              userProfile?.profile?.avatarHash &&
              `${appVariables.RENDER_SERVICE_URL}/get/${userProfile.profile.avatarHash}`
            }
            size="large"
            status={isItMe ? currentUser?.status : userProfile?.status}
          />
          {!isItMe
            ? showUserInteractions && (
                <>
                  <Button label={t('actions.flyTo')} onClick={handleFlyToUser} size="small" />
                  {userProfile?.status !== UserStatusEnum.DO_NOT_DISTURB && (
                    <>
                      <Button
                        label={t('actions.grabTable')}
                        onClick={() => {
                          grabATable();
                        }}
                        size="small"
                      />
                      <Button
                        label={t('actions.highFive')}
                        onClick={() => {
                          if (userProfile?.uuid) {
                            unityStore.sendHighFive(userProfile.uuid);
                          }
                        }}
                        size="small"
                      />
                    </>
                  )}
                </>
              )
            : profileStore.canCreateInitiative && (
                <Button
                  label={t('actions.createInitiative')}
                  onClick={launchInitiativeStore.dialog.open}
                  size="small"
                />
              )}
        </styled.Actions>
        <styled.Details>
          {userProfile?.profile?.bio && (
            <Text text={userProfile.profile.bio} size="xs" align="left" />
          )}
          <styled.Info>
            {userProfile?.profile?.location && (
              <styled.InfoItem>
                <IconSvg name="location" size="normal" />
                <styled.LocationText
                  text={userProfile.profile.location}
                  size="xxs"
                  isMultiline={false}
                />
              </styled.InfoItem>
            )}

            {userProfile?.profile?.profileLink && (
              <styled.InfoItem>
                <IconSvg name="link" size="normal" />
                <styled.Link href={absoluteLink(userProfile.profile.profileLink)} target="_blank">
                  {withoutProtocol(userProfile.profile.profileLink)}
                </styled.Link>
              </styled.InfoItem>
            )}

            <styled.InfoItem>
              <IconSvg name="astro" size="normal" />
              <Text
                text={`${capitalize(t('actions.joined'))} ${renderDate() as string}`}
                size="xxs"
                isMultiline={false}
              />
            </styled.InfoItem>
          </styled.Info>
          <UserSpaceList
            spaceList={userSpaceList}
            flyToSpace={handleFlyToSpace}
            selectSpace={handleSelectSpace}
          />
        </styled.Details>
      </styled.Body>
    </PanelLayout>
  );
};

export default observer(ProfileWidget);
