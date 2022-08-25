import React, {FC} from 'react';

import {PageTopBar} from 'ui-kit';

import * as styled from './AtomsPage.styled';

const AtomsPage: FC = () => {
  return (
    <styled.Div>
      <PageTopBar title="Momentum «ui-kit»" subtitle="Atoms" />
      <styled.Components>Atoms</styled.Components>
    </styled.Div>
  );
};

export default AtomsPage;
