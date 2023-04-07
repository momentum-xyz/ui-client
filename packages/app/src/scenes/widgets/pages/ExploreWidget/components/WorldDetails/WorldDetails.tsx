import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage} from 'ui-kit';
import {WorldDetailsType} from 'stores/UniverseStore/models';

import * as styled from './WorldDetails.styled';

interface PropsInterface {
  worldDetails: WorldDetailsType;
  onUserClick: (userId: string) => void;
  onVisit: (worldId: string) => void;
  onStake: (worldId: string) => void;
  onClose: () => void;
}

const WorldDetails: FC<PropsInterface> = (props) => {
  const {worldDetails, onVisit, onStake, onUserClick, onClose} = props;
  const {world} = worldDetails;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="WorldDetails-test">
      <Panel
        icon="rabbit_fill"
        variant="primary"
        image={getImageAbsoluteUrl(world.image, ImageSizeEnum.S3)}
        title={t('labels.odysseyOverview')}
        onClose={onClose}
      >
        <styled.Wrapper>
          {/* FIXME: REAL DATA */}
          <ProfileImage
            name={world.name}
            image={world.image}
            imageErrorIcon="rabbit_fill"
            byName={world.name}
            onByClick={() => onUserClick(world.uuid)}
          />

          <styled.GeneralScrollable>
            {/* FIXME: REAL DATA */}
            <ProfileInfo
              description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean commodo ligula eget dolor..."
              address="http://www.google.com"
              joinDate={new Date().toISOString()}
              onVisit={() => onVisit(world.uuid)}
              onStake={() => onStake(world.uuid)}
            />
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetails);
