import React, {FC} from 'react';

import {EventItemInterface} from 'core/models';
import {SvgButton} from 'ui-kit';

import * as styled from './Actions.styled';

interface PropsInterface {
  event: EventItemInterface;
  onEdit?: (event: EventItemInterface) => void;
  onRemove?: (event: EventItemInterface) => void;
}

const Actions: FC<PropsInterface> = ({event, onRemove, onEdit}) => {
  return (
    <styled.Actions data-testid="Actions-test">
      <SvgButton
        iconName="bin"
        size="medium"
        onClick={() => {
          onRemove?.(event);
        }}
      />
      <SvgButton
        iconName="edit"
        size="medium"
        onClick={() => {
          onEdit?.(event);
        }}
      />
    </styled.Actions>
  );
};

export default Actions;
