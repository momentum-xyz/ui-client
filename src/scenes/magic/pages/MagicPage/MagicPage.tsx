import React, {useEffect} from 'react';
import {useHistory, useParams} from 'react-router';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {MagicTypeEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';
import {ToastContent} from 'ui-kit';

interface MagicPageProps {
  children?: React.ReactNode;
}

const MagicPage: React.FC<MagicPageProps> = (props) => {
  const {
    mainStore: {unityStore},
    magicStore
  } = useStore();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();
  const {key} = useParams<{key: string}>();

  const {t} = useTranslation();

  useEffect(() => {
    if (key) {
      magicStore.getMagicLink(key);
    }
  }, [key]);

  const handleMagic = () => {
    if (!magicStore.magic) {
      return;
    }

    if (magicStore.magic.expired) {
      history.replace({pathname: ROUTES.base});
      return;
    }

    const id = magicStore.magic.data.id;

    switch (magicStore.magic.type) {
      case MagicTypeEnum.OPEN_SPACE:
        unityStore.teleportToSpace(id);
        magicStore
          .requestSpaceEnter(id)
          .then(() => joinMeetingSpace(id))
          .then(() => {
            setTimeout(() => {
              history.replace({
                pathname: ROUTES.dashboard
              });
            }, 3000);
          })
          .catch(() => {
            toast.error(
              <ToastContent
                isDanger
                headerIconName="alert"
                title={t('titles.alert')}
                text={t('collaboration.spaceIsPrivate')}
                isCloseButton
              />
            );
          });
        break;
      case MagicTypeEnum.FLY: {
        unityStore.teleportToVector3(magicStore.magic.data.position);
        history.replace({pathname: ROUTES.base});
        break;
      }
      case MagicTypeEnum.EVENT: {
        unityStore.teleportToSpace(id);
        magicStore
          .requestSpaceEnter(id)
          .then(() => joinMeetingSpace(id))
          .then(() => {
            setTimeout(() => {
              history.replace({
                pathname: `${ROUTES.calendar}/${magicStore.magic?.data.eventId ?? ''}`
              });
            }, 3000);
          })
          .catch(() => {
            toast.error(
              <ToastContent
                isDanger
                headerIconName="alert"
                title={t('titles.alert')}
                text={t('collaboration.spaceIsPrivate')}
                isCloseButton
              />
            );
          });
        break;
      }
      default:
        history.replace({pathname: ROUTES.base});
        break;
    }
  };

  useEffect(() => {
    if (unityStore.teleportReady) {
      handleMagic();
    }
  }, [magicStore.magic, unityStore.teleportReady]);

  return <>{props.children}</>;
};

export default observer(MagicPage);
