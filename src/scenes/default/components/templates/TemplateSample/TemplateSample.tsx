import React, {FC, memo} from 'react';

import {OrganismSample} from 'scenes/default/components';

import * as styled from './TemplateSample.styled';

interface OrganismSampleProps {
  isActive: boolean;
}

/* Just for sample */

const TemplateSample: FC<OrganismSampleProps> = ({isActive}) => {
  return (
    <styled.Div>
      <OrganismSample isActive={isActive} />
    </styled.Div>
  );
};

export default memo(TemplateSample);
