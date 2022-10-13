import React, {FC} from 'react';
import {SvgButton} from '@momentum-xyz/ui-kit';

import * as styled from './UserSpaceItem.styled';

interface PropsInterface {
  spaceId: string;
  spaceName: string;
  flyToSpace: (spaceId: string) => void;
  selectSpace: (spaceId: string) => void;
}

const UserSpaceItem: FC<PropsInterface> = (props) => {
  const {spaceName, spaceId, selectSpace, flyToSpace} = props;

  return (
    <styled.Container
      key={spaceId}
      onClick={() => selectSpace(spaceId)}
      data-testid="UserSpaceItem-test"
    >
      <SvgButton iconName="rocket" size="medium" onClick={() => flyToSpace(spaceId)} />
      <styled.NameText text={spaceName} size="xs" align="left" />
    </styled.Container>
  );
};

export default UserSpaceItem;
