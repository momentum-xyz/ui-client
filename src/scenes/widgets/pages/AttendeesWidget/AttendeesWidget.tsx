import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {Avatar, Dialog, SearchInput, Text, useDebouncedEffect} from 'ui-kit';

import * as styled from './AttendeesWidget.styled';

const AttendeesWidget: FC = () => {
  const {
    widgetStore: {attendeesListStore}
  } = useStore();

  const {t} = useTranslation();

  useDebouncedEffect(
    () => {
      attendeesListStore.fetchAttendees();
    },
    500,
    [attendeesListStore.query]
  );

  return (
    <Dialog
      title="Gathering Name"
      subtitle={`Attendee List / ${t('counts.attendees', {
        count: attendeesListStore.numberOfAttendees
      })}`}
      onClose={attendeesListStore.resetModel}
      headerStyle="uppercase"
      icon="profile"
      iconSize="large"
      hasBorder
      showCloseButton
    >
      <styled.Container>
        <SearchInput
          placeholder={t('placeholders.searchForAttendees')}
          onChange={(query) => attendeesListStore.changeQuery(query)}
          withBackground
        />
        <styled.List className="noScrollIndicator">
          {attendeesListStore.attendees.map((attendee) => (
            <styled.Item key={attendee.id}>
              <Avatar avatarSrc={attendee.avatarSrc} size="small" />
              <Text size="s" text={attendee.name} />
            </styled.Item>
          ))}
        </styled.List>
      </styled.Container>
    </Dialog>
  );
};

export default observer(AttendeesWidget);
