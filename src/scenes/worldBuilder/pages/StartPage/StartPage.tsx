import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {WorldBuilderFooter, WorldBuilderHeader} from 'scenes/worldBuilder/components';

import * as styled from './StartPage.styled';

const StartPage: FC = () => {
  const {sessionStore} = useStore();

  const {t} = useTranslation();
  const history = useHistory();

  return (
    <styled.Container>
      <styled.Spacer />
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
            history.push(ROUTES.login, {from: ROUTES.worldBuilder.start});
          }
        }}
      />
    </styled.Container>
  );
};

export default observer(StartPage);
