import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {capitalize} from 'lodash-es';

import {useStore} from 'shared/hooks';
import {absoluteLink, monthAndYearString} from 'core/utils';
import {Button, IconSvg, SvgButton, Avatar, PanelLayout, Text} from 'ui-kit';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';
import SocialUserInitiatives from 'component/molucules/socialui/SocialUserInitiatives';
import {endpoints} from 'api/constants';

import * as styled from './ProfileWidget.styled';

interface ProfileWidgetPropsInterface {
  userId: string;
  onClose: () => void;
  onUserInitiativeSelect: (Buffer) => void;
  onEditUser: (userId: string) => void;
}

const ProfileWidget: React.FC<ProfileWidgetPropsInterface> = ({
  userId,
  onClose,
  onUserInitiativeSelect,
  onEditUser
}) => {
  const {
    widgetStore,
    sessionStore,
    mainStore: {unityStore, worldStore}
  } = useStore();
  const {profile: currentUser} = sessionStore;
  const {profileStore, launchInitiativeStore} = widgetStore;
  const {userProfile} = profileStore;
  const history = useHistory();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();

  useEffect(() => {
    profileStore.fetchProfile(userId);

    return () => {
      profileStore.resetModel();
    };
  }, [userId]);

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

  const renderDate = () => {
    if (!userProfile?.createdAt) return;
    const date = new Date(userProfile.createdAt);
    return monthAndYearString(date);
  };

  const isItMe = () => {
    if (!currentUser || !userProfile) return false;
    return currentUser.uuid === userProfile.uuid;
  };

  return (
    <PanelLayout
      title={
        isItMe()
          ? t('labels.myBio')
          : userProfile && t('labels.someonesBio', {name: userProfile.name})
      }
      captureAllPointerEvents
      headerActions={
        isItMe() && <SvgButton iconName="edit" size="normal" onClick={() => onEditUser(userId)} />
      }
      onClose={onClose}
    >
      <styled.Body>
        <styled.Actions>
          <Avatar
            avatarSrc={
              userProfile?.profile?.avatarHash &&
              `${endpoints.renderService}/get/${userProfile.profile.avatarHash}`
            }
            size="large"
          />
          {!isItMe() ? (
            <>
              <Button label={t('actions.flyTo')} onClick={handleFlyToUser} size="small" />
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
                  profileStore.sendHighFive();
                }}
                size="small"
              />
            </>
          ) : (
            profileStore.canCreateInitiative && (
              <Button
                label={t('actions.createInitiative')}
                onClick={launchInitiativeStore.dialog.open}
                size="small"
              />
            )
          )}
        </styled.Actions>
        <styled.Details>
          {userProfile?.profile?.bio && (
            <Text text={userProfile.profile.bio} size="xs" align="left" />
          )}
          <styled.Info>
            {userProfile?.profile?.location && (
              <styled.InfoItem className="restricted">
                <IconSvg name="location" size="normal" />
                <Text text={userProfile.profile.location} size="xxs" isMultiline={false} isCustom />
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

            {userProfile?.profile?.profileLink && (
              <styled.InfoItem>
                <IconSvg name="link" size="normal" />
                <styled.Link href={absoluteLink(userProfile.profile.profileLink)} target="_blank">
                  {userProfile.profile.profileLink}
                </styled.Link>
              </styled.InfoItem>
            )}
          </styled.Info>
          <SocialUserInitiatives userId={userId} onInitiativeSelect={onUserInitiativeSelect} />
        </styled.Details>
      </styled.Body>
    </PanelLayout>
  );
};

export default observer(ProfileWidget);
