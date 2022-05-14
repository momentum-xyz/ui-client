import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {TemplateSample} from 'scenes/default/components';

import * as styled from './DefaultPage.styled';

/* Just for sample */

const DefaultPage: FC = () => {
  const {defaultStore} = useStore().defaultStore;
  const {isActive} = defaultStore;

  alert(isActive);

  return (
    <styled.Div>
      <TemplateSample isActive={isActive} />
    </styled.Div>
  );
};

export default observer(DefaultPage);
