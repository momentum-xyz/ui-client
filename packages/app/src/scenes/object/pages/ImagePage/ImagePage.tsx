import {FC} from 'react';
import {Heading} from '@momentum-xyz/ui-kit';
import {Frame} from '@momentum-xyz/ui-kit-storybook';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './ImagePage.styled';

const ImagePage: FC = () => {
  const {content, imageSrc} = useStore().objectStore.assetStore;

  return (
    <styled.Container>
      <Heading type="h2" label={content?.title || ''} transform="uppercase" />
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

export default observer(ImagePage);
