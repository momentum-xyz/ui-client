import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage} from 'ui-kit';
import {UserDetailsType} from 'stores/UniverseStore/models';

import * as styled from './UserDetails.styled';

interface PropsInterface {
  userDetails: UserDetailsType;
  onVisit: (worldId: string) => void;
  onStake: (worldId: string) => void;
  onClose: () => void;
}

const UserDetails: FC<PropsInterface> = (props) => {
  const {userDetails, onClose} = props;
  const {user} = userDetails;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="UserDetails-test">
      <Panel
        icon="astronaut"
        variant="primary"
        image={getImageAbsoluteUrl(user.image, ImageSizeEnum.S3)}
        title={t('labels.memberProfile')}
        onClose={onClose}
      >
        <styled.Wrapper>
          {/* FIXME: REAL DATA */}
          <ProfileImage name={user.name} image={user.image} imageErrorIcon="astronaut" />

          <styled.GeneralScrollable>
            {/* FIXME: REAL DATA */}
            <ProfileInfo
              hash={user.owner}
              description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean commodo ligula eget dolor..."
              address="http://www.google.com"
              joinDate={new Date().toISOString()}
            />
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(UserDetails);
