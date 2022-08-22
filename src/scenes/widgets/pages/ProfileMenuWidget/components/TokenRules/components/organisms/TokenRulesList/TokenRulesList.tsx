import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {TokenRuleListHeader, TokenRuleStatus} from 'core/enums';
import {IconSvg} from 'ui-kit';
import {TokenRuleItemModelInterface} from 'core/models';
import {TokenRuleListHeaderType} from 'core/types';
import {TokenRulesColumnHeaderInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import * as styled from './TokenRulesList.styled';

interface PropsInterface {
  columnHeaders: TokenRulesColumnHeaderInterface[];
  onEventClick?: (tokenRule: TokenRuleItemModelInterface) => void;
}

const TokenRulesList: FC<PropsInterface> = ({columnHeaders, onEventClick}) => {
  const {widgetStore} = useStore();
  const {profileMenuStore} = widgetStore;
  const {tokenRulesStore} = profileMenuStore;

  useEffect(() => {
    tokenRulesStore.sortTokens(TokenRuleListHeader.NAME);
  }, []);

  const getCell = (key: TokenRuleListHeaderType, item: TokenRuleItemModelInterface) => {
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
                    tokenRulesStore.sortTokens(header.key);
                  }
                }}
              >
                <div>{header.label}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokenRulesStore.tokenRules?.map((item) => (
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
      {(!tokenRulesStore.tokenRules || tokenRulesStore.tokenRules?.length === 0) && (
        <styled.NoTokensMessage>{t('tokenRules.noTokenRules')}</styled.NoTokensMessage>
      )}
    </styled.TokenRuleListContainer>
  );
};

export default observer(TokenRulesList);
