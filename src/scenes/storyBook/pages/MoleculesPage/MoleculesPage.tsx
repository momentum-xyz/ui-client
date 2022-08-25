import React, {FC} from 'react';

import {PageTopBar} from 'ui-kit';

import * as styled from './MoleculesPage.styled';

const MoleculesPage: FC = () => {
  return (
    <styled.Div>
      <PageTopBar title="Momentum «ui-kit»" subtitle="Molecules" />
      <styled.Components>Molecules</styled.Components>
    </styled.Div>
  );
};

export default MoleculesPage;
