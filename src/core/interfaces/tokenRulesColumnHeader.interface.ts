import {TokenRuleListHeaderType} from 'core/types';

export interface TokenRulesColumnHeaderInterface {
  key: TokenRuleListHeaderType;
  sortable: boolean;
  label?: string;
  icon?: IconName;
  isSmall?: boolean;
}
