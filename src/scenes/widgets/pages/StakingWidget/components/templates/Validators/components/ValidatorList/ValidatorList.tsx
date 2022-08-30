import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {IconSvg} from 'ui-kit/atoms';
import {useSortableData} from 'ui-kit/hooks';
import {ValidatorItemModelInterface} from 'core/models';

import * as styled from './ValidatorList.styled';

export interface ColumnHeader {
  key: string;
  sortable: boolean;
  label?: string;
  icon?: IconName;
  eventName?: string;
  isSmall?: boolean;
  truncate?: boolean;
}

interface PropsInterface extends PropsWithThemeInterface {
  columnHeaders: ColumnHeader[];
  data: ValidatorItemModelInterface[];
  onEventClick: (eventName: string, item: ValidatorItemModelInterface) => void;
}

const ValidatorList: FC<PropsInterface> = ({columnHeaders, data, onEventClick, theme}) => {
  const {items, requestSort, sortConfig} = useSortableData(data);

  const getSortIconNameFor = (name: string) => {
    if (!sortConfig) {
      return 'sort';
    }
    return sortConfig.key === name
      ? 'sortOn' + sortConfig.direction.charAt(0).toUpperCase() + sortConfig.direction.substring(1)
      : 'sort';
  };

  const getCell = (key: keyof ValidatorItemModelInterface, item: ValidatorItemModelInterface) => {
    if (key === 'isBookmarked') {
      return <IconSvg name={item[key] ? 'starOn' : 'star'} size="medium" />;
    } else if (key === 'selected') {
      return <IconSvg name={item[key] ? 'checkmark' : 'check'} size="medium" />;
    } else if (key === 'info' && item[key]) {
      return <IconSvg name="info" size="medium" />;
    } else if (key === 'hasLink' && item[key]) {
      return <IconSvg name="rocket" size="medium" />;
    } else {
      const value = item[key] ? item[key] : '';
      return <span title={value}>{value}</span>;
    }
  };

  const handleCellClick = (header: ColumnHeader, item: ValidatorItemModelInterface) => {
    if (header.eventName) {
      onEventClick(header.eventName, item);
    }
  };

  return (
    <styled.ValidatorListContainer theme={theme}>
      <styled.ValidatorListTable>
        <thead>
          <tr>
            {columnHeaders?.map((header) => (
              <th
                key={header.key}
                onClick={() => {
                  if (header.sortable) {
                    requestSort(header.key);
                  }
                }}
                className={`${header.sortable ? 'clickable' : ''}`}
              >
                <div className="th-container">
                  <div>{header.label}</div>
                  {header.sortable && (
                    <button>
                      <IconSvg name={getSortIconNameFor(header.key) as IconName} size="medium" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columnHeaders.map((header) => (
                <td
                  className={`
                  ${header.eventName ? 'clickable' : ''}  
                  ${item.selected && header.key === 'entity' ? 'selected' : ''}  
                  ${header.truncate ? 'truncate' : ''}  
                  ${header.isSmall ? 'small-column' : ''}`}
                  key={item.id + '-' + header.key}
                  onClick={() => handleCellClick(header, item as ValidatorItemModelInterface)}
                >
                  {getCell(
                    header.key as keyof ValidatorItemModelInterface,
                    item as ValidatorItemModelInterface
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </styled.ValidatorListTable>
    </styled.ValidatorListContainer>
  );
};

export default observer(ValidatorList);
