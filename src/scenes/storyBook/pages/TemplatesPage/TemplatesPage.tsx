import React, {FC} from 'react';

import {PageTopBar} from 'ui-kit';

import * as styled from './TemplatesPage.styled';

const TemplatesPage: FC = () => {
  return (
    <styled.Div>
      <PageTopBar title="Momentum «ui-kit»" subtitle="Templates" />
      <styled.Components>Templates</styled.Components>
    </styled.Div>
  );
};

export default TemplatesPage;
