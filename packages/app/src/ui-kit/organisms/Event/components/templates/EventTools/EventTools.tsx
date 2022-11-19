import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {Button, IconSvg} from '@momentum-xyz/ui-kit';
import AddToCalendarHOC, {SHARE_SITES} from 'react-add-to-calendar-hoc';

import {AddToCalendarDropdown} from 'ui-kit';
import {EventItemModelInterface, UserModelInterface} from 'core/models';

import * as styled from './EventTools.styled';

interface PropsInterface {
  event: EventItemModelInterface;
  onWeblinkClick: (weblink: string) => void;
  user?: UserModelInterface;
}

const EventTools: FC<PropsInterface> = ({event, onWeblinkClick, user}) => {
  const AddToCalendarComponent = AddToCalendarHOC(Button, AddToCalendarDropdown);

  const handleAttending = () => {
    if (!user) {
      return;
    }
    event.attending(event?.data?.spaceId ?? '', user, event.data);
  };
  const handleWithdrawAttending = () => {
    if (!user) {
      return;
    }
    event.withdrawAttending(event?.data?.spaceId ?? '', user.id, event.data);
  };

  return (
    <styled.Buttons className="base">
      <styled.Buttons>
        {!!event.data?.web_link && (
          <styled.EventButton
            label={t('eventList.eventItem.websiteLink')}
            icon="link"
            transform="capitalized"
            onClick={() => onWeblinkClick(event.data?.web_link ?? '')}
          />
        )}
      </styled.Buttons>
      <styled.Buttons>
        {event.isLive ? (
          <styled.LiveIndicator>
            <IconSvg name="live" size="medium-large" isWhite />
            <p>{t('eventList.eventItem.live')}</p>
          </styled.LiveIndicator>
        ) : (
          <Button
            variant={event.isAttending(user?.id ?? '') ? 'inverted' : 'primary'}
            icon={event.isAttending(user?.id ?? '') ? 'check' : 'add'}
            disabled={event.isLoading}
            label={t('eventList.eventItem.interested')}
            transform="capitalized"
            onClick={event.isAttending(user?.id ?? '') ? handleWithdrawAttending : handleAttending}
          />
        )}
        <Button
          variant="primary"
          label={t('counts.attendees', {count: event.attendeesList.attendees.length})}
          transform="capitalized"
          onClick={event.attendeesList.dialog.open}
        />
        {!event.isLive && (
          <AddToCalendarComponent
            event={event.asCalendarEvent}
            buttonProps={{
              label: t('eventList.eventItem.addToCalendar'),
              icon: 'calendar',
              className: 'add-calendar-button',
              transform: 'capitalized',
              noWhitespaceWrap: true
            }}
            items={[SHARE_SITES.GOOGLE, SHARE_SITES.ICAL, SHARE_SITES.OUTLOOK]}
            className="AddToCalendarContainer"
          />
        )}
      </styled.Buttons>
    </styled.Buttons>
  );
};

export default observer(EventTools);
