import {FC} from 'react';
import {Heading} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './ImagePage.styled';

const ImagePage: FC = () => {
  const {content, imageSrc} = useStore().objectStore.assetStore;

  return (
    <styled.ContentWrapper>
      <Heading type="h2" label={content?.title || ''} transform="uppercase" />
      {imageSrc && <styled.ImageWrapper src={imageSrc} alt="" />}
    </styled.ContentWrapper>
  );
};

export default observer(ImagePage);
