import React from 'react';
import {observer} from 'mobx-react-lite';
import {SvgButton} from '@momentum-xyz/ui-kit';

import {SpaceInfoModelInterface} from 'core/models';

import * as styled from './SpaceListItem.styled';

export interface SpaceItemPropsInterface {
  spaceInfo: SpaceInfoModelInterface;
  isFavorite: boolean;
  onTeleportToSpace: (spaceId: string) => void;
  onSelectSpace: (spaceId: string) => void;
}

const SpaceListItem: React.FC<SpaceItemPropsInterface> = (props) => {
  const {spaceInfo, isFavorite, onSelectSpace, onTeleportToSpace} = props;

  const handleFlyToSpace = () => {
    onTeleportToSpace(spaceInfo.id);
  };

  const handleSelect = () => {
    onSelectSpace(spaceInfo.id);
  };

  return (
    <styled.Container data-testid="SpaceListItem-test">
      <SvgButton iconName="rocket" size="medium" onClick={handleFlyToSpace} />
      <styled.Wrapper onClick={handleSelect}>
        <styled.SpaceNameText text={spaceInfo.name} size="xs" align="left" isMultiline={false} />
        <styled.Spacer />
        {isFavorite && <styled.FavouriteIcon name="starOn" size="normal" />}
        {spaceInfo.hasSubspaces && <styled.NextButton iconName="chevron" size="medium" />}
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SpaceListItem);
