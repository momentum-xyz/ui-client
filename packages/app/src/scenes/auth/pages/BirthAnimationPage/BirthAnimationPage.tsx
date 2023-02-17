import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useSupernova} from 'shared/hooks';

const DELAY_MS = 10 * 1000;

const BirthAnimationPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(ROUTES.explore);
    }, DELAY_MS);
  }, [navigate]);

  useSupernova();

  return <></>;
};

export default observer(BirthAnimationPage);
