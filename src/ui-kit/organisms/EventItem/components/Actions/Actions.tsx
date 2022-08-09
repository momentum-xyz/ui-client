import React, {FC} from 'react';

import {EventItemModelInterface} from 'core/models';
import {SvgButton} from 'ui-kit';

import * as styled from './Actions.styled';

interface PropsInterface {
  event: EventItemModelInterface;
  onEdit?: (event: EventItemModelInterface) => void;
  onRemove?: (eventId: string) => void;
}

const Actions: FC<PropsInterface> = ({event, onRemove, onEdit}) => {
  return (
    <styled.Actions data-testid="Actions-test">
      {onRemove && (
        <SvgButton
          iconName="bin"
          size="medium"
          onClick={() => {
            onRemove(event.id);
          }}
        />
      )}
      {onEdit && (
        <SvgButton
          iconName="edit"
          size="medium"
          onClick={() => {
            onEdit(event);
          }}
        />
      )}
    </styled.Actions>
  );
};

export default Actions;
