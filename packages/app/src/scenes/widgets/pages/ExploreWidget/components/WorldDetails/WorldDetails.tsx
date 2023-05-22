import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {Panel, ImageSizeEnum, Frame} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileInfo, ProfileImage, StakersList, StakingComment, StakingAmount} from 'ui-kit';
import {WorldModelInterface} from 'core/models';

import * as styled from './WorldDetails.styled';

interface PropsInterface {
  world: WorldModelInterface;
  onSelectUser: (userId: string) => void;
  onVisitWorld: (worldId: string) => void;
  onStakeWorld: (worldId: string) => void;
  onClose: () => void;
}

const WorldDetails: FC<PropsInterface> = ({
  world,
  onVisitWorld,
  onStakeWorld,
  onSelectUser,
  onClose
}) => {
  const {t} = useI18n();

  useEffect(() => {
    Universe3dEmitter.emit('WorldSelected', world.id);
  }, [world.id]);

  return (
    <styled.Container data-testid="WorldDetails-test">
      <Panel
        isFullHeight
        size="normal"
        icon="rabbit_fill"
        variant="primary"
        image={getImageAbsoluteUrl(world?.avatarHash, ImageSizeEnum.S3)}
        title={t('labels.odysseyOverview')}
        onClose={onClose}
      >
        <styled.Wrapper>
          <Frame>
            <ProfileImage
              name={world.name || world.id}
              image={world.avatarHash}
              imageErrorIcon="rabbit_fill"
              byName={world.owner_name || world.owner_id}
              onByClick={() => onSelectUser(world.owner_id)}
            />

            <ProfileInfo
              description={world.description}
              weblink={world.website_link}
              createDate={world.createdAt}
              onVisit={() => onVisitWorld(world.id)}
              onStake={() => onStakeWorld(world.id)}
            />
          </Frame>

          <styled.Info>
            <StakingAmount stakedAmount={world.momStaked} tokenSymbol="MOM" />

            {!!world.last_staking_comment && (
              <StakingComment comment={world.last_staking_comment} />
            )}

            <StakersList stakers={world.stakers} onSelectUser={onSelectUser} />
          </styled.Info>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetails);
