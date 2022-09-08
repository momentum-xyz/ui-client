import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import AddToCalendarHOC, {SHARE_SITES} from 'react-add-to-calendar-hoc';
import {observer} from 'mobx-react-lite';

import {EventItemInterface} from 'core/models';
import {AddToCalendarDropdown, Button, IconSvg, ShowMoreText, Text} from 'ui-kit';
import placeholder from 'static/images/placeholder.png';
import {truncateText} from 'core/utils';

import {Header, Actions} from './components';
import * as styled from './EventItem.styled';

interface PropsInterface {
  event: EventItemInterface;
  currentUserId: string;
  onEdit: (event: EventItemInterface) => void;
  onRemove: (event: EventItemInterface) => void;
  onMagicLinkOpen: (eventId: string, spaceId?: string) => void;
  zIndex?: number;
  showOnWorldCalendar?: boolean;
  onFlyToGathering?: (spaceId: string) => void;
  onFlyToSpace?: (spaceId: string) => void;
  onWeblinkClick: (weblink: string) => void;
  onShowAttendeesList: (eventName: string, eventId: string, spaceId: string) => void;
  canManageEvent?: boolean;
}

const EventItem: FC<PropsInterface> = ({
  event,
  currentUserId,
  onEdit,
  onRemove,
  zIndex,
  showOnWorldCalendar = false,
  onMagicLinkOpen,
  onFlyToGathering,
  onFlyToSpace,
  onWeblinkClick,
  onShowAttendeesList,
  canManageEvent = false
}) => {
  const AddToCalendarComponent = AddToCalendarHOC(Button, AddToCalendarDropdown);

  useEffect(() => {
    event.init();
  }, [event]);

  const handleAttendingButtonClick = () => {
    if (event.isAttending(currentUserId)) {
      event.stopAttending();
    } else {
      event.attend();
    }
  };

  const buttons = () => (
    <styled.Buttons className="base">
      <styled.Buttons>
        {showOnWorldCalendar && event.data?.spaceId && (
          <styled.EventButton
            label={`${t('eventList.eventItem.flyToSpace')} ${truncateText(event.data?.spaceName)}`}
            transform="capitalized"
            onClick={() => {
              onFlyToSpace?.(event.data?.spaceId ?? '');
            }}
            icon="fly-to"
            noWhitespaceWrap
          />
        )}

        <styled.EventButton
          onClick={() => {
            if (event) {
              onMagicLinkOpen(event.data?.id ?? '', event.data?.spaceId ?? undefined);
            }
          }}
          label={t('eventList.eventItem.gatheringLink')}
          icon="location"
          transform="capitalized"
        />
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
        <Button
          variant="primary"
          label={t('counts.attendees', {count: event.numberOfAllAttendees})}
          transform="capitalized"
          onClick={() =>
            onShowAttendeesList(
              event.data?.title ?? '',
              event.data?.id ?? '',
              event.data?.spaceId ?? ''
            )
          }
        />
        {event.isLive() ? (
          <styled.LiveIndicator>
            <IconSvg name="live" size="medium-large" isWhite />
            <p>{t('eventList.eventItem.live')}</p>
          </styled.LiveIndicator>
        ) : (
          <Button
            variant={event.isAttending(currentUserId) ? 'inverted' : 'primary'}
            icon={event.isAttending(currentUserId) ? 'check' : 'add'}
            disabled={event.attendRequest.isPending}
            label={t('eventList.eventItem.interested')}
            transform="capitalized"
            onClick={handleAttendingButtonClick}
          />
        )}
        {!event.isLive() && (
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
        {event.isLive() && showOnWorldCalendar && event.data?.id && (
          <Button
            variant="inverted"
            icon="fly-to"
            label={t('eventList.eventItem.joinGathering')}
            transform="capitalized"
            onClick={() => {
              if (event.data?.spaceId) {
                onFlyToGathering?.(event.data?.spaceId);
              }
            }}
          />
        )}
      </styled.Buttons>
    </styled.Buttons>
  );

  const date = () => (
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
  );

  const info = () => (
    <styled.Div>
      <styled.Info>
        <styled.ContentRow>
          <styled.TextRow>
            <Header event={event} isWorldCalendar={showOnWorldCalendar} />
            {date()}
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
            {event.attendees.map((attendee) => (
              <styled.AttendeeContrainer key={attendee.id}>
                <styled.AttendeeAvatar size="normal" avatarSrc={attendee.avatarSrc} />
                <styled.AttendeeNameText
                  text={attendee.name}
                  size="s"
                  align="center"
                  isMultiline={false}
                />
              </styled.AttendeeContrainer>
            ))}
          </styled.AttendeesContainer>
        </styled.ContentRow>
        {buttons()}
        {canManageEvent && <Actions event={event} onEdit={onEdit} onRemove={onRemove} />}
      </styled.Info>
    </styled.Div>
  );

  const image = () => (
    <styled.ImageContainer>
      {event.data?.image_hash ? (
        <img alt={event.data?.image_hash} src={event.imageSrc} />
      ) : (
        <img alt="placeholder" src={placeholder} />
      )}
    </styled.ImageContainer>
  );

  return (
    <styled.Container style={{zIndex: zIndex}} id={event.data?.id} data-testid="EventItem-test">
      <styled.Row className="header">{image()}</styled.Row>
      {info()}
    </styled.Container>
  );
};

export default observer(EventItem);
