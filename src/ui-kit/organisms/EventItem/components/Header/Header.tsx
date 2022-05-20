import React, {FC} from 'react';

import {EventItemModelInterface} from 'core/models';

import * as styled from './Header.styled';

interface PropsInterface {
  event: EventItemModelInterface;
  isWorldCalendar?: boolean;
}

const Header: FC<PropsInterface> = ({event, isWorldCalendar}) => {
  return (
    <styled.Container>
      {isWorldCalendar ? (
        <styled.Header>
          <styled.Header className="bold">{event.spaceName ?? ''}</styled.Header>
          <styled.Header className="bold"> / </styled.Header>
          <styled.Header className="notBold">{event.title}</styled.Header>
          <styled.TextHeader> / </styled.TextHeader>
          <styled.TextHeader>{event.hosted_by}</styled.TextHeader>
        </styled.Header>
      ) : (
        <styled.Header>
          <styled.Header className="bold">{event.title}</styled.Header>
          <styled.Header className="bold"> / </styled.Header>
          <styled.TextHeader>{event.hosted_by}</styled.TextHeader>
        </styled.Header>
      )}
    </styled.Container>
  );
};

export default Header;
