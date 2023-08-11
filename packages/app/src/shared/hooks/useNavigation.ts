import {useCallback} from 'react';
import {generatePath, useNavigate} from 'react-router-dom';
import {PositionEnum} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {WidgetEnum} from 'core/enums';

import {useStore} from './useStore';

export const useNavigation = () => {
  const {universeStore, widgetManagerStore} = useStore();
  const baseWorldId = universeStore.worldId;

  const navigate = useNavigate();

  const goToOdysseyHome = useCallback(
    (worldId = baseWorldId) => {
      console.log(`Redirect to world ${worldId}`);

      if (worldId === baseWorldId) {
        /* Navigate user inside World */
        navigate(generatePath(ROUTES.odyssey.base, {worldId}));
      } else if (!baseWorldId) {
        /* Navigate user from Universe to World */
        navigate(generatePath(ROUTES.odyssey.base, {worldId}));
      } else {
        /* Navigate user from World to World */
        navigate(generatePath(ROUTES.odyssey.base, {worldId}));
        //document.location = generatePath(ROUTES.odyssey.base, {worldId});
      }
    },
    [navigate, baseWorldId]
  );

  const goToOdysseyAndStake = useCallback(
    (worldId: string) => {
      goToOdysseyHome(worldId);

      /* Try to open the Stake Widget if it was not a hard redirect */
      setTimeout(() => {
        widgetManagerStore.open(WidgetEnum.STAKING, PositionEnum.RIGHT);
      }, 300);
    },
    [goToOdysseyHome, widgetManagerStore]
  );

  const goToOdysseyAndEnableCreator = useCallback(
    (worldId: string) => {
      goToOdysseyHome(worldId);

      setTimeout(() => {
        widgetManagerStore.open(WidgetEnum.CREATOR, PositionEnum.RIGHT);
      }, 300);
    },
    [goToOdysseyHome, widgetManagerStore]
  );

  return {goToOdysseyHome, goToOdysseyAndStake, goToOdysseyAndEnableCreator};
};
