import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {Avatar, Dialog, SearchInput, Text} from '@momentum-xyz/ui-kit';

import {AttendeesListModelType, EventItemInterface} from 'core/models';

import * as styled from './Attendees.styled';

interface PropsInterface {
  attendeesList: AttendeesListModelType;
  event: EventItemInterface;
}

const DIALOG_WIDTH_PX = 520;

const Attendees: FC<PropsInterface> = (props) => {
  const {attendeesList, event} = props;

  const {t} = useI18n();

  const handleClose = () => {
    attendeesList.dialog.close();
    attendeesList.searchAttendees('');
  };

  return (
    <>
      <Dialog
        title={event.data?.title}
        subtitle={`${t('labels.attendeeList')} / ${t('counts.attendees', {
          count: attendeesList.attendees.length
        })}`}
        onClose={handleClose}
        headerStyle="uppercase"
        icon="profile"
        iconSize="large"
        hasBorder
        showCloseButton
        showOverflow
        layoutSize={{width: `${DIALOG_WIDTH_PX}px;`}}
      >
        <styled.Container data-testid="AttendeesWidget-test">
          <SearchInput
            placeholder={t('placeholders.searchForAttendees') || ''}
            onChange={(query) => attendeesList.searchAttendees(query)}
            withBackground
          />
          <styled.List className="noScrollIndicator">
            {attendeesList.searchedAttendees
              ? attendeesList.searchedAttendees.map((attendee) => (
                  <styled.Item key={attendee.id}>
                    <Avatar avatarSrc={attendee.avatarSrc} size="small" />
                    <Text size="s" text={attendee.name} transform="capitalized" />
                  </styled.Item>
                ))
              : attendeesList.attendees.map((attendee) => (
                  <styled.Item key={attendee.id}>
                    <Avatar avatarSrc={attendee.avatarSrc} size="small" />
                    <Text size="s" text={attendee.name} transform="capitalized" />
                  </styled.Item>
                ))}
          </styled.List>
        </styled.Container>
      </Dialog>
    </>
  );
};

export default observer(Attendees);
