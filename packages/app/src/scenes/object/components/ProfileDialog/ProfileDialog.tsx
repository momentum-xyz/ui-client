import {Dialog, Heading, Button, Avatar, Text, IconSvg} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback} from 'react';
import {monthAndYearString} from '@momentum-xyz/core';
import {useTranslation} from 'react-i18next';
import {generatePath, useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import * as styled from './ProfileDialog.styled';

const OFFSET_LEFT = 10;
const OFFSET_TOP = 20;

// TODO: Change to DockDialog
const ProfileDialog: FC = () => {
  const {objectStore, mainStore, authStore} = useStore();
  const {assetStore} = objectStore;
  const {dockContent} = assetStore;
  const {unityStore} = mainStore;

  const {t} = useTranslation();

  const history = useHistory();

  const renderDate = () => {
    if (!dockContent?.createdAt) {
      return '';
    }

    const date = new Date(dockContent.createdAt);
    return monthAndYearString(date);
  };

  const handleTeleportToOdyssey = useCallback(() => {
    const worldId = dockContent?.id ?? '';

    console.log(`Teleport in unity to ${worldId}`);
    history.push(generatePath(ROUTES.odyssey.base, {worldId}));
    unityStore.loadWorldById(worldId, authStore.token);
  }, [authStore.token, dockContent?.id, history, unityStore]);

  if (!dockContent) {
    return null;
  }

  return (
    <Dialog
      title="Profile"
      position="leftTop"
      offset={{left: OFFSET_LEFT, top: OFFSET_TOP}}
      headerStyle="normal"
      icon="people"
      iconSize="medium"
      headerType="h2"
      onClose={() => {}}
      showCloseButton
    >
      <styled.Body>
        <styled.Header>
          <Avatar
            avatarSrc={dockContent.avatarSrc}
            size="normal"
            // status={user.status}
          />
          <styled.NameAndAction>
            <Heading
              type="h1"
              label={dockContent?.name ?? ''}
              isTruncate
              transform="uppercase"
              align="left"
              weight="bold"
            />
            <Button icon="fly-to" size="medium" label="Visit" onClick={handleTeleportToOdyssey} />
          </styled.NameAndAction>
        </styled.Header>
        <styled.InfoItem>
          <IconSvg name="astro" size="normal" />
          <Text
            size="xxs"
            text={`${t('actions.joined')} ${renderDate()}`}
            transform="capitalized"
            isMultiline={false}
          />
        </styled.InfoItem>
      </styled.Body>
    </Dialog>
  );
};

export default observer(ProfileDialog);
