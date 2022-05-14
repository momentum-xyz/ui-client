import {t} from 'i18next';

import {Payee} from 'core/enums';

export const REWARD_DESTINATION_TYPES = [
  {
    label: t('staking.stashIncreaseAmount'),
    value: Payee.Staked,
    icon: 'wallet' as IconName
  },
  {
    label: t('staking.stashNoIncreaseAmount'),
    value: Payee.Stash,
    icon: 'wallet' as IconName
  },
  {
    label: t('staking.controllerAccount'),
    value: Payee.Controller,
    icon: 'wallet' as IconName
  }
];
