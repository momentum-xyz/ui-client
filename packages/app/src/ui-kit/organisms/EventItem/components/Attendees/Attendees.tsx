import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Avatar, Dialog, SearchInput, Text, useDebouncedEffect} from '@momentum-xyz/ui-kit';

import {EventAttendeesModelType} from 'core/models';

import * as styled from './Attendees.styled';

interface PropsInterface {
  attendees: EventAttendeesModelType;
}

const Attendees: FC<PropsInterface> = (props) => {
  const {attendees} = props;

  const {t} = useTranslation();

  useDebouncedEffect(
    () => {
      attendees.fetchAttendees();
    },
    500,
    [attendees.query]
  );

  return (
    <>
      <Dialog
        title={attendees.eventName}
        subtitle={`${t('labels.attendeeList')} / ${t('counts.attendees', {
          count: attendees.numberOfAttendees
        })}`}
        onClose={attendees.resetModel}
        headerStyle="uppercase"
        icon="profile"
        iconSize="large"
        hasBorder
        showCloseButton
        showOverflow
        layoutSize={{width: '519px;'}}
      >
        {/* TODO: Refactoring !!! */}
        {attendees.attendeeDialog.isOpen && attendees.selectedAttendeeId && (
          <styled.AttendeeWidget
            userId={attendees.selectedAttendeeId}
            onClose={attendees.hideAttendee}
            showUserInteractions={false}
            hasBorder
          />
        )}
        <styled.Container data-testid="AttendeesWidget-test">
          <SearchInput
            placeholder={t('placeholders.searchForAttendees')}
            onChange={(query) => attendees.changeQuery(query)}
            withBackground
          />
          <styled.List className="noScrollIndicator">
            {attendees.attendees.map((attendee) => (
              <styled.Item
                key={attendee.id}
                onClick={() => {
                  attendees.selectAttendee(attendee);
                }}
              >
                <Avatar avatarSrc={attendee.avatarSrc} size="small" />
                <Text size="s" text={attendee.name} />
              </styled.Item>
            ))}
          </styled.List>
        </styled.Container>
      </Dialog>
    </>
  );
};

export default observer(Attendees);
