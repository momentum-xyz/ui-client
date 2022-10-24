import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {IconSvg} from '@momentum-xyz/ui-kit';

import {TokenRuleListHeaderEnum, TokenRuleStatusEnum} from 'core/enums';
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
    tokenRulesStore.sortTokens(TokenRuleListHeaderEnum.NAME);
  }, []);

  const getCell = (key: TokenRuleListHeaderType, item: TokenRuleItemModelInterface) => {
    const status = TokenRuleListHeaderEnum.STATUS;
    if (key === TokenRuleListHeaderEnum.INFO) {
      return (
        <IconSvg
          name="info"
          size="medium"
          onClick={() => onEventClick?.(item)}
          isWhite={item[status] === TokenRuleStatusEnum.REQUESTED}
          isDanger={item[status] === TokenRuleStatusEnum.DECLINED}
        />
      );
    } else if (key === TokenRuleListHeaderEnum.ICON) {
      return (
        <IconSvg
          name={
            item[status] === TokenRuleStatusEnum.APPROVED
              ? 'approved'
              : item[status] === TokenRuleStatusEnum.DECLINED
              ? 'denied'
              : 'requested'
          }
          size="medium"
          isWhite={item[status] === TokenRuleStatusEnum.REQUESTED}
          isDanger={item[status] === TokenRuleStatusEnum.DECLINED}
        />
      );
    } else if (key === TokenRuleListHeaderEnum.STATUS) {
      return (
        <styled.Span
          className={`${item[status] === TokenRuleStatusEnum.APPROVED ? 'approved' : ''}
          ${item[status] === TokenRuleStatusEnum.DECLINED ? 'declined' : ''}
          ${item[status] === TokenRuleStatusEnum.REQUESTED ? 'requested' : ''}
                `}
        >
          {item[key]}
        </styled.Span>
      );
    }

    return <>{item[key]}</>;
  };

  return (
    <styled.TokenRuleListContainer data-testid="TokenRuleList-test">
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
                  ${header.key === TokenRuleListHeaderEnum.INFO ? 'clickable' : ''}
                  ${header.key === TokenRuleListHeaderEnum.STATUS ? 'approved' : ''}
                  ${header.key === TokenRuleListHeaderEnum.STATUS ? 'declined' : ''}`}
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
