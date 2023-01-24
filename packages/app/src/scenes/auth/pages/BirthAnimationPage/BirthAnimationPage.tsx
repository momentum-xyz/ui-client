import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useSupernova} from 'shared/hooks';

const DELAY_MS = 10 * 1000;

const BirthAnimationPage: FC = () => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.push(ROUTES.explore);
    }, DELAY_MS);
  }, [history]);

  useSupernova();

  return <></>;
};

export default observer(BirthAnimationPage);
