import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Avatar, SvgButton, UserStatusEnum} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftItemModelInterface} from 'core/models';

import * as styled from './OdysseyList.styled';

interface PropsInterface {
  odysseyList: NftItemModelInterface[];
  onTeleport: (nft: NftItemModelInterface) => void;
  onSelect: (nft: NftItemModelInterface) => void;
}

const OdysseyList: FC<PropsInterface> = (props) => {
  const {odysseyList, onSelect, onTeleport} = props;

  return (
    <styled.Inner data-testid="OdysseyList-test">
      {odysseyList.map((odyssey) => (
        <styled.Container key={odyssey.id}>
          <styled.InfoContainer onClick={() => onSelect(odyssey)}>
            <Avatar
              size="small"
              avatarSrc={getImageAbsoluteUrl(odyssey.image) || undefined}
              status={UserStatusEnum.ONLINE}
            />
            <styled.StyledText
              text={odyssey.name.trim()}
              size="xxs"
              align="left"
              isMultiline={false}
            />
          </styled.InfoContainer>
          <SvgButton iconName="fly-portal" size="medium" onClick={() => onTeleport(odyssey)} />
        </styled.Container>
      ))}
    </styled.Inner>
  );
};

export default observer(OdysseyList);
