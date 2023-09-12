import {FC} from 'react';
import {Hexagon} from '@momentum-xyz/ui-kit';
import {dateWithoutTime, getTime} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './ObjectOwnerHeading.styled';

interface PropsInterface {
  authorName: string | null | undefined;
  authorAvatarHash?: string | null | undefined;
  datetime?: string;
}

export const ObjectOwnerHeading: FC<PropsInterface> = ({
  authorName,
  authorAvatarHash,
  datetime
}) => {
  return (
    <styled.Header>
      <Hexagon
        iconName="astronaut"
        type="fourth-borderless"
        imageSrc={getImageAbsoluteUrl(authorAvatarHash)}
      />

      <styled.UserInfo>
        <styled.UserInfoTitle>
          <styled.UserName>{authorName}</styled.UserName>
          <styled.Date>
            {!!datetime && (
              <div>
                {dateWithoutTime(datetime)} / {getTime(datetime)}
              </div>
            )}
          </styled.Date>
        </styled.UserInfoTitle>
      </styled.UserInfo>
    </styled.Header>
  );
};
