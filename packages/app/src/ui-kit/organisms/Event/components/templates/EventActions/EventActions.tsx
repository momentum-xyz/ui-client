import React, {FC} from 'react';
import {SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import {EventItemModelInterface} from 'core/models';

import * as styled from './EventActions.styled';

interface PropsInterface {
  event: EventItemModelInterface;
  onEdit: (event: EventItemModelInterface) => void;
  onRemove: (event: EventItemModelInterface) => void;
}

const EventActions: FC<PropsInterface> = ({event, onRemove, onEdit}) => {
  return (
    <styled.Actions data-testid="EventActions-test">
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

export default observer(EventActions);
