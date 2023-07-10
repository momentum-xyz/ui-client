import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame} from '@momentum-xyz/ui-kit';

import {CustomizableObjectInterface} from 'api';

import * as styled from './ContentViewer.styled';

interface PropsInterface {
  content: CustomizableObjectInterface;
  onDelete?: () => void;
  onEdit?: () => void;
}

const ContentViewer: FC<PropsInterface> = ({content}) => {
  return (
    <styled.Container data-testid="ContentViewer-test">
      <Frame>{content.title}</Frame>
    </styled.Container>
  );
};

export default observer(ContentViewer);
