import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame} from '@momentum-xyz/ui-kit';

import {WorldModelInterface} from 'core/models';
import {ProfileImage, ProfileInfo, StakersList, StakingAmount, StakingComment} from 'ui-kit';

import * as styled from './WorldView.styled';

interface PropsInterface {
  world: WorldModelInterface;
  onStakeWorld: () => void;
  onSelectUser: (userId: string) => void;
}

const WorldView: FC<PropsInterface> = ({world, onStakeWorld, onSelectUser}) => {
  return (
    <styled.Container data-testid="WorldProfileWidget-test">
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
          onStake={onStakeWorld}
        />
      </Frame>

      <styled.Wrapper>
        <StakingAmount stakedAmount={world.momStaked} tokenSymbol="MOM" />

        {!!world.last_staking_comment && <StakingComment comment={world.last_staking_comment} />}

        <StakersList stakers={world.stakers} onSelectUser={onSelectUser} />
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(WorldView);
