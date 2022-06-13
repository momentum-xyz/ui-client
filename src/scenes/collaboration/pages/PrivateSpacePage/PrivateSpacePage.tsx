import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';

import {Text, TopBar} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './PrivateSpacePage.styled';

export const PrivateSpacePage: FC = () => {
  const {t} = useTranslation();

  const history = useHistory();

  return (
    <styled.Container>
      <TopBar
        title={history.location.state.spaceName ?? ''}
        onClose={() => history.push(ROUTES.base)}
      />
      <styled.Body>
        <styled.PanelLayoutCustom>
          <Text text={t('collaboration.spaceIsPrivate')} size="l" />
        </styled.PanelLayoutCustom>
      </styled.Body>
    </styled.Container>
  );
};

export default PrivateSpacePage;
