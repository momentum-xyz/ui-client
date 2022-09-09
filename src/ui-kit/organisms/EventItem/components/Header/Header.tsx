import React, {FC} from 'react';

import {EventItemInterface} from 'core/models';

import * as styled from './Header.styled';

interface PropsInterface {
  event: EventItemInterface;
  isWorldCalendar?: boolean;
}

const Header: FC<PropsInterface> = ({event, isWorldCalendar}) => {
  return (
    <styled.Container data-testid="Header-test">
      {isWorldCalendar ? (
        <styled.Header>
          <styled.Header className="bold">{event.data?.spaceName ?? ''}</styled.Header>
          <styled.Header className="bold"> / </styled.Header>
          <styled.Header className="notBold">{event.data?.title}</styled.Header>
          <styled.TextHeader> / </styled.TextHeader>
          <styled.TextHeader>{event.data?.hosted_by}</styled.TextHeader>
        </styled.Header>
      ) : (
        <styled.Header>
          <styled.Header className="bold">{event.data?.title}</styled.Header>
          <styled.Header className="bold"> / </styled.Header>
          <styled.TextHeader>{event.data?.hosted_by}</styled.TextHeader>
        </styled.Header>
      )}
    </styled.Container>
  );
};

export default Header;
