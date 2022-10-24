import React, {FC} from 'react';
import {SvgButton} from '@momentum-xyz/ui-kit';

import {EventItemInterface} from 'core/models';

import * as styled from './Actions.styled';

interface PropsInterface {
  event: EventItemInterface;
  onEdit: (event: EventItemInterface) => void;
  onRemove: (event: EventItemInterface) => void;
}

const Actions: FC<PropsInterface> = ({event, onRemove, onEdit}) => {
  return (
    <styled.Actions data-testid="Actions-test">
      <SvgButton
        iconName="bin"
        size="medium"
        onClick={() => {
          onRemove(event);
        }}
      />
      <SvgButton
        iconName="edit"
        size="medium"
        onClick={() => {
          onEdit(event);
        }}
      />
    </styled.Actions>
  );
};

export default Actions;
