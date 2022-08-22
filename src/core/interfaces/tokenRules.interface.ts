import {TokenRuleListHeaderType} from '../types';

export interface ColumnHeaderInterface {
  key: TokenRuleListHeaderType;
  sortable: boolean;
  label?: string;
  icon?: IconName;
  isSmall?: boolean;
}
