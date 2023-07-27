import {FC} from 'react';

import * as styled from './Loader.styled';

export interface LoaderPropsInterface {
  fill?: boolean;
}

const Loader: FC<LoaderPropsInterface> = ({fill}) => {
  return (
    <styled.Container data-testid="Loader-test" fill={fill}>
      <styled.Item />
      <styled.Item />
      <styled.Item />
    </styled.Container>
  );
};

export default Loader;
