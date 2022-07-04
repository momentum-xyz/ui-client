import {Payee} from 'core/enums';

import {i18n} from '../../shared/services/index';

export const REWARD_DESTINATION_TYPES = [
  {
    label: i18n.t('staking.stashIncreaseAmount'),
    value: Payee.Staked,
    icon: 'wallet' as IconName
  },
  {
    label: i18n.t('staking.stashNoIncreaseAmount'),
    value: Payee.Stash,
    icon: 'wallet' as IconName
  },
  {
    label: i18n.t('staking.controllerAccount'),
    value: Payee.Controller,
    icon: 'wallet' as IconName
  },
  {
    label: i18n.t('staking.specifiedPaymentAccount'),
    value: Payee.Account,
    icon: 'wallet' as IconName
  }
];
