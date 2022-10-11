import {IconNameType} from '@momentum/ui-kit';

import {TokenRuleListHeaderType} from 'core/types';

export interface TokenRulesColumnHeaderInterface {
  key: TokenRuleListHeaderType;
  sortable: boolean;
  label?: string;
  icon?: IconNameType;
  isSmall?: boolean;
}
