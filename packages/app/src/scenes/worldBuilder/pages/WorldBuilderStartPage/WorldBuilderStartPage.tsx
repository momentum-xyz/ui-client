import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {Page, WorldBuilderFooter, WorldBuilderHeader} from 'ui-kit';
import background from 'static/images/worldBuilder.png';

import * as styled from './WorldBuilderStartPage.styled';

const WorldBuilderStartPage: FC = () => {
  const {sessionStore, worldBuilderStore} = useStore();

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (sessionStore.isSessionExists) {
      worldBuilderStore.fetchPermissions();
    }
  }, [sessionStore.isSessionExists, worldBuilderStore]);

  useEffect(() => {
    if (worldBuilderStore.haveAccess === false) {
      //history.push(`${ROUTES.worldBuilderLogin}?noPermissions=true`, {
      //  from: history.location.pathname
      //});
    }
  }, [history, worldBuilderStore.haveAccess]);

  if (worldBuilderStore.canAccessPages) {
    return null;
  }

  return (
    <Page backgroundSrc={background} showSimpleProfileMenu={sessionStore.isSessionExists}>
      <styled.Container>
        <styled.Information>
          <WorldBuilderHeader />
          <styled.Description text={t('messages.worldBuilderDescription')} size="xxl" />
        </styled.Information>
        <WorldBuilderFooter
          buttonLabel={sessionStore.isSessionExists ? t('actions.getStarted') : t('actions.logIn')}
          onNext={() => {
            if (sessionStore.isSessionExists) {
              history.push(ROUTES.worldBuilder.name);
            } else {
              //history.push(ROUTES.worldBuilderLogin, {from: ROUTES.worldBuilder.start});
            }
          }}
        />
      </styled.Container>
    </Page>
  );
};

export default observer(WorldBuilderStartPage);
