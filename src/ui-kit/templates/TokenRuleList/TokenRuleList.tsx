import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {TokenRulesListStoreInterface} from 'scenes/widgets/stores/TokenRulesListStore';
import {TokenRuleListHeader, TokenRuleStatus} from 'core/enums';
import {IconSvg} from 'ui-kit';
import {TokenRuleItemModelInterface} from 'core/models';

import * as styled from './TokenRuleList.styled';

export interface ColumnHeader {
  key: string;
  sortable: boolean;
  label?: string;
  icon?: IconName;
  isSmall?: boolean;
}

// TODO data type should be what comes from API not any
interface PropsInterface {
  columnHeaders: ColumnHeader[];
  onEventClick?: (tokenRule: TokenRuleItemModelInterface) => void;
  store: TokenRulesListStoreInterface;
}

const TokenRuleList: FC<PropsInterface> = ({columnHeaders, onEventClick, store}) => {
  const {sortTokens, tokenRules} = store;

  useEffect(() => {
    sortTokens(TokenRuleListHeader.NAME);
  }, []);

  const getCell = (key: string, item: TokenRuleItemModelInterface) => {
    const status = TokenRuleListHeader.STATUS;
    if (key === TokenRuleListHeader.INFO) {
      return <IconSvg name="info" size="medium" isCustom onClick={() => onEventClick?.(item)} />;
    } else if (key === TokenRuleListHeader.ICON) {
      return (
        <IconSvg
          name={
            item[status] === TokenRuleStatus.APPROVED
              ? 'approved'
              : item[status] === TokenRuleStatus.DECLINED
              ? 'denied'
              : 'requested'
          }
          size="medium"
          isWhite={item[status] === TokenRuleStatus.REQUESTED}
          isDanger={item[status] === TokenRuleStatus.DECLINED}
        />
      );
    } else if (key === TokenRuleListHeader.STATUS) {
      return (
        <styled.Span
          className={`${item[status] === TokenRuleStatus.APPROVED ? 'approved' : ''}
          ${item[status] === TokenRuleStatus.DECLINED ? 'declined' : ''}
          ${item[status] === TokenRuleStatus.REQUESTED ? 'requested' : ''}
                `}
        >
          {item[key]}
        </styled.Span>
      );
    }

    // @ts-ignore: refactoring
    return <>{item[key]}</>;
  };

  return (
    <styled.TokenRuleListContainer className="noScrollIndicator" data-testid="TokenRuleList-test">
      <styled.TokenRuleListTable>
        <thead>
          <tr>
            {columnHeaders?.map((header) => (
              <th
                key={header.key}
                className={`${header.sortable ? 'clickable' : ''}
                `}
                onClick={() => {
                  if (header.sortable) {
                    sortTokens(header.key);
                  }
                }}
              >
                <div>{header.label}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokenRules?.map((item) => (
            <tr key={item.id}>
              {columnHeaders.map((header) => (
                <td
                  className={`
                  ${header.isSmall ? 'small-column' : ''}
                  ${header.key === TokenRuleListHeader.INFO ? 'clickable' : ''}
                  ${header.key === TokenRuleListHeader.STATUS ? 'approved' : ''}
                  ${header.key === TokenRuleListHeader.STATUS ? 'declined' : ''}`}
                  key={item.id + '-' + header.key}
                >
                  {getCell(header.key, item as TokenRuleItemModelInterface)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </styled.TokenRuleListTable>
      {(!tokenRules || tokenRules?.length === 0) && (
        <styled.NoTokensMessage>{t('tokenRules.noTokenRules')}</styled.NoTokensMessage>
      )}
    </styled.TokenRuleListContainer>
  );
};

export default observer(TokenRuleList);
