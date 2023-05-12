import {FC} from 'react';
import {Frame} from '@momentum-xyz/ui-kit-storybook';
import {observer} from 'mobx-react-lite';

import * as styled from './ImageViewer.styled';

interface PropsInterface {
  imageSrc: string | null;
}

const ImageViewer: FC<PropsInterface> = ({imageSrc}) => {
  return (
    <styled.Container data-testid="ImageViewer-test">
      {imageSrc && (
        <styled.ImageContainer>
          <Frame>
            <styled.PreviewImageHolder style={{backgroundImage: `url(${imageSrc})`}} />
          </Frame>
        </styled.ImageContainer>
      )}
    </styled.Container>
  );
};

export default observer(ImageViewer);
