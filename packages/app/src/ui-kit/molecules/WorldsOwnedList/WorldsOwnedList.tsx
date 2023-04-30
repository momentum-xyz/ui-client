import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {IconSvg, ItemCard, ImageSizeEnum} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {WorldInfoModelInterface} from 'core/models';

import * as styled from './WorldsOwnedList.styled';

interface PropsInterface {
  worldsOwned: WorldInfoModelInterface[];
  onVisitWorld: (worldId: string) => void;
  onSelectWorld: (worldId: string) => void;
}

const WorldsOwnedList: FC<PropsInterface> = ({worldsOwned, onVisitWorld, onSelectWorld}) => {
  const {t} = useI18n();

  return (
    <styled.OdysseyList data-testid="WorldsOwnedList-test">
      {worldsOwned.length > 0 && (
        <>
          <styled.Title>
            <IconSvg name="rabbit_fill" size="xs" isWhite />
            <span>{t('labels.odysseysOwned')}</span>
          </styled.Title>
          {worldsOwned.map((world) => (
            <ItemCard
              key={world.id}
              variant="small"
              name={world.name}
              imageHeight={95}
              description={world.description}
              imageErrorIcon="rabbit_fill"
              imageUrl={getImageAbsoluteUrl(world.avatarHash, ImageSizeEnum.S5)}
              onVisitClick={() => onVisitWorld(world.id)}
              onInfoClick={() => onSelectWorld(world.id)}
            />
          ))}
        </>
      )}
    </styled.OdysseyList>
  );
};

export default observer(WorldsOwnedList);
