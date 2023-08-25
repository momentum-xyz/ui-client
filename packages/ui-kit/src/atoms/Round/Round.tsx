import {FC, memo} from 'react';

import * as styled from './Round.styled';

export interface RoundPropsInterface {
  label: string | number;
}

const Round: FC<RoundPropsInterface> = ({label}) => {
  return <styled.Round data-testid="Round-test">{label}</styled.Round>;
};

export default memo(Round);
