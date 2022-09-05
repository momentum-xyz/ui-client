import {PayeeEnum} from 'core/enums';

import {i18n} from '../../shared/services/index';

export const REWARD_DESTINATION_TYPES = [
  {
    label: i18n.t('staking.stashIncreaseAmount'),
    value: PayeeEnum.Staked,
    icon: 'wallet' as IconNameType
  },
  {
    label: i18n.t('staking.stashNoIncreaseAmount'),
    value: PayeeEnum.Stash,
    icon: 'wallet' as IconNameType
  },
  {
    label: i18n.t('staking.controllerAccount'),
    value: PayeeEnum.Controller,
    icon: 'wallet' as IconNameType
  },
  {
    label: i18n.t('staking.specifiedPaymentAccount'),
    value: PayeeEnum.Account,
    icon: 'wallet' as IconNameType
  }
];
