import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {WorldModelInterface} from 'core/models';
import {ProfileImage, ProfileInfo, StakersList, StakingAmount, StakingComment} from 'ui-kit';

import * as styled from './WorldEditor.styled';

interface PropsInterface {
  world: WorldModelInterface;
  onStakeWorld: (worldId: string) => void;
  onSelectUser: (userId: string) => void;
}

const WorldEditor: FC<PropsInterface> = ({world, onStakeWorld, onSelectUser}) => {
  return (
    <styled.Container data-testid="WorldProfileWidget-test">
      <ProfileImage
        name={world.name || world.id}
        image={world.avatarHash}
        imageErrorIcon="rabbit_fill"
        byName={world.owner_name || world.owner_id}
        onByClick={() => onSelectUser(world.owner_id)}
      />

      <styled.GeneralScrollable>
        <ProfileInfo
          description={world.description}
          joinDate={world.createdAt}
          onStake={() => onStakeWorld(world.id)}
        />

        <StakingAmount stakedAmount={world.momStaked} tokenSymbol="MOM" />

        {!!world.last_staking_comment && <StakingComment comment={world.last_staking_comment} />}

        <StakersList stakers={world.stakers} onSelectUser={onSelectUser} />
      </styled.GeneralScrollable>
    </styled.Container>
  );
};

export default observer(WorldEditor);
