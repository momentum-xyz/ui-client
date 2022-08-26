import React, {FC} from 'react';

import {PageTopBar} from 'ui-kit';

import * as styled from './OrganismsPage.styled';

const OrganismsPage: FC = () => {
  return (
    <styled.Div>
      <PageTopBar title="Momentum «ui-kit»" subtitle="Organisms" />
      <styled.Components>Organisms</styled.Components>
    </styled.Div>
  );
};

export default OrganismsPage;
