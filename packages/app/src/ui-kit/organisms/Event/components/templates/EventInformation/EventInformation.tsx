import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {ShowMoreText, Text} from '@momentum-xyz/ui-kit';
import {t} from 'i18next';

import {EventItemModelInterface} from 'core/models';

import {EventHeader} from '../EventHeader';

import * as styled from './EventInformation.styled';

interface PropsInterface {
  event: EventItemModelInterface;
}

const EventInformation: FC<PropsInterface> = ({event}) => {
  return (
    <styled.ContentRow>
      <styled.TextRow>
        <styled.DateRow>
          <Text text={event.startDate} size="l" weight="bold" align="left" transform="uppercase" />
          <Text text={event.startTime} size="l" align="left" />
          <Text
            text={`${t('eventList.eventItem.to')} ${event.endDateAndTime}`}
            size="l"
            transform="uppercase"
            align="left"
          />
        </styled.DateRow>
        <EventHeader event={event} />
        <ShowMoreText
          text={event.data?.description ?? ''}
          textProps={{
            size: 's',
            align: 'left',
            firstBoldSentences: 1
          }}
        />
      </styled.TextRow>
      <styled.AttendeesContainer>
        {event.attendeesList.attendees.map((attendee, index) => (
          <styled.AttendeeContrainer key={index}>
            <styled.AttendeeAvatar size="normal" avatarSrc={attendee.avatarSrc} />
            <styled.AttendeeNameText
              text={attendee.name}
              size="s"
              align="center"
              isMultiline={false}
              transform="capitalized"
            />
          </styled.AttendeeContrainer>
        ))}
      </styled.AttendeesContainer>
    </styled.ContentRow>
  );
};

export default observer(EventInformation);
