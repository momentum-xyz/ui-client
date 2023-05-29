import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {signUpDateString, useI18n} from '@momentum-xyz/core';
import {Hexagon, MenuLabel, ProfileLine} from '@momentum-xyz/ui-kit';

import {formatBigInt} from 'core/utils';
import {WorldModelInterface} from 'core/models';

import * as styled from './CurrentWorld.styled';

interface PropsInterface {
  world: WorldModelInterface;
  onViewWorld: () => void;
  onStakeWorld: () => void;
}

const CurrentWorld: FC<PropsInterface> = ({world, onViewWorld, onStakeWorld}) => {
  const {name, imageSrc, createdAt, stakersCount, momStaked} = world;
  const {t} = useI18n();

  console.log('[WORLD] MOMs staked into world: ', momStaked);

  return (
    <styled.Container data-testid="CurrentWorld-test">
      <styled.Content>
        <styled.Name>
          <span>{name}</span>
        </styled.Name>
        <styled.Information>
          <ProfileLine
            icon="stake"
            label={`${formatBigInt(momStaked)} MOM ${t('labels.stakedIn').toLowerCase()}`}
          />
          <ProfileLine icon="connect" label={`${stakersCount} ${t('labels.stakers')}`} />
          <ProfileLine
            icon="astro"
            label={`${t('actions.created')} ${signUpDateString(createdAt)}`}
          />
        </styled.Information>
        <styled.Label>
          <MenuLabel text={t('actions.stakeInOdyssey')} type="left" />
        </styled.Label>
      </styled.Content>

      <styled.Hexagons>
        <Hexagon type="menu" iconName="rabbit_fill" imageSrc={imageSrc} onClick={onViewWorld} />
        <styled.BlankHexagons>
          <styled.BlankHexagon1>
            <Hexagon type="blank-small" />
          </styled.BlankHexagon1>
          <styled.BlankHexagon2>
            <Hexagon type="blank-small" />
          </styled.BlankHexagon2>
          <styled.BlankHexagon3>
            <Hexagon type="blank-small" />
          </styled.BlankHexagon3>
        </styled.BlankHexagons>
        <Hexagon type="menu" iconName="stake" onClick={onStakeWorld} />
        <styled.BlankHexagonLast>
          <Hexagon type="blank-small" />
        </styled.BlankHexagonLast>
      </styled.Hexagons>
    </styled.Container>
  );
};

export default observer(CurrentWorld);
