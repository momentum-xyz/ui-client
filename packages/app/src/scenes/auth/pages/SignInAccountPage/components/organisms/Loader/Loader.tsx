import {FC} from 'react';
import {FrameText} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './Loader.styled';

interface PropsInterface {
  title?: string;
  line?: string;
}

const Loader: FC<PropsInterface> = ({title, line}) => {
  return (
    <>
      <styled.Container>
        <FrameText
          title={title || 'Please wait'}
          line1={
            line ||
            'Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.'
          }
        />
        <styled.Separator />
      </styled.Container>
    </>
  );
};

export default Loader;
