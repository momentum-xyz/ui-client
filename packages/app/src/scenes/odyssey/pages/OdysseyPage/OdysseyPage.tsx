import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {matchPath, useLocation} from 'react-router-dom';
//import cn from 'classnames';
//import {Button} from '@momentum-xyz/ui-kit';

// import {generatePath, useHistory} from 'react-router-dom';
// import {useTranslation} from 'react-i18next';
// import {Button} from '@momentum-xyz/ui-kit';
//
// import {useStore} from 'shared/hooks';
// import {ROUTES} from 'core/constants';

//import {useStore} from 'shared/hooks';

//import {ExplorePanel} from './components';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './OdysseyPage.styled';
const OdysseyPage: FC = () => {
  const {mainStore} = useStore();
  const {unityStore} = mainStore;

  // const {widgetsStore} = useStore();
  //const {socialStore} = widgetsStore;
  //const {widget: socialWidget} = socialStore;
  // const {onlineUsersStore, userProfileDialog} = homeStore;
  // const {unityStore} = mainStore;
  //
  // const {t} = useTranslation();
  // const history = useHistory();
  //
  // const rejoinMeeting = useCallback(
  //   (spaceId) => {
  //     unityStore.teleportToSpace(spaceId);
  //     history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
  //   },
  //   [unityStore, history]
  // );

  const location = useLocation();

  useEffect(() => {
    if (!matchPath(location.pathname, ROUTES.odyssey.builder.base)) {
      unityStore.objectMenu.close();
    }
  }, [location.pathname, unityStore.objectMenu]);

  return (
    <styled.Container data-testid="HomePage-test">
      {/*<styled.PanelWrapper />*/}

      {/*<styled.PanelWrapper>
      <styled.PanelWrapper className={cn(socialWidget.isOpen && 'voiceChatOpen')}>
        <ExplorePanel />
      </styled.PanelWrapper>*/}

      {/*<styled.PanelWrapper>*/}
      {/*  {meetingStore.canRejoin && (*/}
      {/*    <styled.Rejoin>*/}
      {/*      <Button*/}
      {/*        variant="primary"*/}
      {/*        label={t('actions.rejoinMeeting')}*/}
      {/*        onClick={() => rejoinMeeting(meetingStore.lastSpaceId)}*/}
      {/*      />*/}
      {/*    </styled.Rejoin>*/}
      {/*  )}*/}

      {/*  <styled.UsersContainer>*/}
      {/*    {onlineUsersStore.selectedUserId && (*/}
      {/*      <div>*/}
      {/*        <UserProfilePanel*/}
      {/*          userId={onlineUsersStore.selectedUserId}*/}
      {/*          onClose={() => {*/}
      {/*            onlineUsersStore.unselectUser();*/}
      {/*            userProfileDialog.close();*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*    <OnlineUsersPanel />*/}
      {/*  </styled.UsersContainer>*/}
      {/*</styled.PanelWrapper>*/}
    </styled.Container>
  );
};

export default observer(OdysseyPage);
