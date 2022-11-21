import React, {FC} from 'react';
import {Button} from '@momentum-xyz/ui-kit';

import * as styled from './TabBarButtons.styled';

interface PropsInterface {
  calendar: string;
}

const TabBarButtons: FC<PropsInterface> = ({calendar}) => {
  return (
    <styled.Buttons data-testid="TabBarButtons-test">
      <Button
        label={calendar}
        size="normal"
        transform="capitalized"
        variant="inverted-background"
        height="short-height"
      />
    </styled.Buttons>
  );
};

export default TabBarButtons;
