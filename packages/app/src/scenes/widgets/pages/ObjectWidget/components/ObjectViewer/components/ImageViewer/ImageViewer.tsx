import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './ImageViewer.styled';

interface PropsInterface {
  imageSrc?: string | null;
}

const ImageViewer: FC<PropsInterface> = ({imageSrc}) => {
  return (
    <styled.Container data-testid="ImageViewer-test">
      {imageSrc && (
        <styled.ImageContainer>
          <styled.PreviewImageHolder style={{backgroundImage: `url(${imageSrc})`}} />
        </styled.ImageContainer>
      )}
    </styled.Container>
  );
};

export default observer(ImageViewer);
