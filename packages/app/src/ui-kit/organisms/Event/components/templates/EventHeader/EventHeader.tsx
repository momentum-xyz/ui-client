import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {EventItemModelInterface} from 'core/models';

import * as styled from './EventHeader.styled';

interface PropsInterface {
  event: EventItemModelInterface;
}

const EventHeader: FC<PropsInterface> = ({event}) => {
  return (
    <styled.Container data-testid="Header-test">
      <styled.Header>
        <styled.Header className="bold">{event.data?.spaceName ?? ''}</styled.Header>
        <styled.Header className="bold"> / </styled.Header>
        <styled.Header className="notBold">{event.data?.title}</styled.Header>
      </styled.Header>
    </styled.Container>
  );
};

export default observer(EventHeader);
