import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate, useParams} from 'react-router';
import {generatePath} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {MagicTypeEnum} from 'core/enums';

const MagicPage: FC = () => {
  const {magicStore} = useStore();

  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  useEffect(() => {
    magicStore.fetchMagicLink(id);

    return () => {
      magicStore.resetModel();
    };
  }, [id, magicStore]);

  useEffect(() => {
    if (!magicStore.magicLink) {
      return;
    }

    const {odysseyId} = magicStore.magicLink.data;

    switch (magicStore.magicLink.type) {
      case MagicTypeEnum.ODYSSEY:
        navigate(generatePath(ROUTES.odyssey.base, {worldId: odysseyId}));
        break;
      default:
        navigate(ROUTES.explore, {replace: true});
        break;
    }
  }, [navigate, magicStore.magicLink]);

  return <></>;
};

export default observer(MagicPage);
