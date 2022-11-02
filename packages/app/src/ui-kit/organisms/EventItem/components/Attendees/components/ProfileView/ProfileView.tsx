import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {capitalize} from 'lodash-es';
import {PanelLayout, Avatar, Text, IconSvg, Heading} from '@momentum-xyz/ui-kit';
import {absoluteLink, monthAndYearString, withoutProtocol} from '@momentum-xyz/core';

import {UserSpaceList} from 'ui-kit/molecules';
import {UserProfileModelInterface, UserSpaceDetailsInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  isItMe: boolean;
  user: UserProfileModelInterface;
  spaceList: UserSpaceDetailsInterface[];
  onClose: () => void;
}

const DIALOG_WIDTH_PX = 390;

const ProfileView: FC<PropsInterface> = (props) => {
  const {user, spaceList, isItMe, onClose} = props;
  const {t} = useTranslation();

  const createdAtAsString = useMemo(() => {
    return user.createdAt ? monthAndYearString(new Date(user.createdAt)) : '';
  }, [user.createdAt]);

  return (
    <div data-testid="UserProfileView-test">
      <PanelLayout
        title={isItMe ? t('labels.myBio') : t('labels.someonesBio', {name: user.name || ''})}
        componentSize={{width: `${DIALOG_WIDTH_PX}px`}}
        hasBorder
        captureAllPointerEvents
        headerPlaceholder
        titleHeight
        onClose={onClose}
      >
        <styled.Body>
          <styled.Actions>
            <Avatar avatarSrc={user.avatarSrc} size="large" status={user.status} />
          </styled.Actions>
          <styled.Details>
            {user.profile?.bio && (
              <Text text={user.profile.bio} size="xs" align="left" breakLongWord />
            )}
            <styled.Info>
              {user.profile?.location && (
                <styled.InfoItem>
                  <IconSvg name="location" size="normal" />
                  <styled.LocationText
                    text={user.profile.location}
                    size="xxs"
                    isMultiline={false}
                  />
                </styled.InfoItem>
              )}

              {user.profile?.profileLink && (
                <styled.InfoItem>
                  <IconSvg name="link" size="normal" />
                  <styled.Link href={absoluteLink(user.profile.profileLink)} target="_blank">
                    {withoutProtocol(user.profile.profileLink)}
                  </styled.Link>
                </styled.InfoItem>
              )}

              <styled.InfoItem>
                <IconSvg name="astro" size="normal" />
                <Text
                  text={`${capitalize(t('actions.joined'))} ${createdAtAsString}`}
                  size="xxs"
                  isMultiline={false}
                />
              </styled.InfoItem>
            </styled.Info>

            <styled.Initiatives>
              <Heading type="h4" label={`${t('labels.initiatives')}:`} align="left" />
            </styled.Initiatives>

            <UserSpaceList spaceList={spaceList} flyToSpace={() => {}} selectSpace={() => {}} />
          </styled.Details>
        </styled.Body>
      </PanelLayout>
    </div>
  );
};

export default observer(ProfileView);
