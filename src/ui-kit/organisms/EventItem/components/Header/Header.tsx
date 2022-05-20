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
          <styled.BoldHeader>{event.spaceName ?? ''}</styled.BoldHeader>
          <styled.BoldHeader> / </styled.BoldHeader>
          <styled.BoldHeader className="notBold">{event.title}</styled.BoldHeader>
          <styled.BoldHeader className="notBold"> / </styled.BoldHeader>
          <styled.NormalHeader>{event.hosted_by}</styled.NormalHeader>
        </styled.Header>
      ) : (
        <styled.Header>
          <styled.BoldHeader>{event.title}</styled.BoldHeader>
          <styled.BoldHeader className="notBold"> / </styled.BoldHeader>
          <styled.NormalHeader>{event.hosted_by}</styled.NormalHeader>
        </styled.Header>
      )}
    </styled.Container>
  );
};

export default Header;
