import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Avatar, Dialog, SearchInput, Text, useDebouncedEffect} from '@momentum-xyz/ui-kit';

import {EventAttendeesModelType} from 'core/models';

import {ProfileView} from './components';
import * as styled from './Attendees.styled';

interface PropsInterface {
  currentUserId: string;
  attendees: EventAttendeesModelType;
}

const DIALOG_WIDTH_PX = 520;

const Attendees: FC<PropsInterface> = (props) => {
  const {attendees, currentUserId} = props;

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
        layoutSize={{width: `${DIALOG_WIDTH_PX}px;`}}
      >
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

        {attendees.attendeeDialog.isOpen && attendees.selectedAttendee && (
          <styled.AttendeeContainer>
            <ProfileView
              isItMe={attendees.selectedAttendeeId === currentUserId}
              user={attendees.selectedAttendee}
              spaceList={[]}
              onClose={attendees.hideAttendee}
            />
          </styled.AttendeeContainer>
        )}
      </Dialog>
    </>
  );
};

export default observer(Attendees);
