import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Avatar, SvgButton, UserStatusEnum} from '@momentum-xyz/ui-kit';

import {NftItemInterface} from 'scenes/birthOfMe/stores/NftStore/models';

import * as styled from './OdysseyList.styled';

interface PropsInterface {
  odysseyList: NftItemInterface[];
  onTeleport: (spaceId: string) => void;
}

const OdysseyList: FC<PropsInterface> = (props) => {
  const {odysseyList, onTeleport} = props;

  return (
    <styled.Inner data-testid="OdysseyList-test">
      {odysseyList.map((odyssey) => (
        <styled.Container key={odyssey.id}>
          <styled.InfoContainer onClick={() => onTeleport(odyssey.id.toString())}>
            <Avatar size="small" avatarSrc={odyssey.image} status={UserStatusEnum.ONLINE} />
            <styled.StyledText
              text={odyssey.name.trim()}
              size="xxs"
              align="left"
              isMultiline={false}
            />
          </styled.InfoContainer>
          <SvgButton
            iconName="fly-to"
            size="medium"
            onClick={() => onTeleport(odyssey.id.toString())}
          />
        </styled.Container>
      ))}
    </styled.Inner>
  );
};

export default observer(OdysseyList);
