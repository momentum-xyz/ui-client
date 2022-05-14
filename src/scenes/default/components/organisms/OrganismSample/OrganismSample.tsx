import React, {FC, memo} from 'react';

import * as styled from './OrganismSample.styled';

interface OrganismSampleProps {
  isActive: boolean;
}

/* Just for sample */

const OrganismSample: FC<OrganismSampleProps> = ({isActive}) => {
  return <styled.Div>{isActive && <div />}</styled.Div>;
};

export default memo(OrganismSample);
