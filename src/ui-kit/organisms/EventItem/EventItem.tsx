import React, {FC} from 'react';
import {t} from 'i18next';
import AddToCalendarHOC, {SHARE_SITES} from 'react-add-to-calendar-hoc';

import {EventItemModelInterface} from 'core/models/EventItem';
import {
  AddToCalendarDropdown,
  Button,
  Heading,
  IconSvg,
  ShowMoreText,
  SvgButton,
  Text
} from 'ui-kit';
import {endpoints} from 'api/constants';

import * as styled from './EventItem.styled';

interface PropsInterface {
  event: EventItemModelInterface;
  onEdit?: (event: EventItemModelInterface) => void;
  onRemove?: (eventId: string) => void;
  onMagicLinkOpen: (eventId: string, spaceId?: string) => void;
  zIndex?: number;
  isWorldCalendar?: boolean;
  onFlyToGathering?: (spaceId: string) => void;
  onFlyToSpace?: (spaceId: string) => void;
  onWeblinkClick: (weblink: string) => void;
}

const EventItem: FC<PropsInterface> = ({
  event,
  onEdit,
  onRemove,
  zIndex,
  isWorldCalendar = false,
  onMagicLinkOpen,
  onFlyToGathering,
  onFlyToSpace,
  onWeblinkClick
}) => {
  const AddToCalendarComponent = AddToCalendarHOC(Button, AddToCalendarDropdown);

  const buttons = () => (
    <styled.Buttons className="base">
      <styled.Buttons>
        {isWorldCalendar && event.spaceId && (
          <Button
            label={t('eventList.eventItem.flyToSpace')}
            isCustom
            onClick={() => onFlyToSpace?.(event.spaceId ?? '')}
            icon="fly-to"
            noWhitespaceWrap
          />
        )}

        <Button
          onClick={() => {
            onMagicLinkOpen(event.id, event.spaceId ?? undefined);
          }}
          label={t('eventList.eventItem.gatheringLink')}
          icon="location"
          isCustom
        />
        {!!event.web_link && (
          <Button
            label={t('eventList.eventItem.websiteLink')}
            icon="link"
            isCustom
            // @ts-ignore
            onClick={() => onWeblinkClick(event.web_link)}
          />
        )}
      </styled.Buttons>
      <styled.Buttons>
        {event.isLive() && (
          <styled.LiveIndicator>
            <IconSvg name="live" size="medium-large" isWhite />
            <p>{t('eventList.eventItem.live')}</p>
          </styled.LiveIndicator>
        )}
        {!event.isLive() && (
          <AddToCalendarComponent
            event={event.asCalendarEvent}
            buttonProps={{
              label: t('eventList.eventItem.addToCalendar'),
              variant: 'inverted',
              icon: 'calendar',
              isCustom: true
            }}
            items={[SHARE_SITES.GOOGLE, SHARE_SITES.ICAL, SHARE_SITES.OUTLOOK]}
            className="AddToCalendarContainer"
          />
        )}
        {event.isLive() && isWorldCalendar && event.spaceId && (
          <Button
            variant="inverted"
            label={t('eventList.eventItem.joinGathering')}
            // @ts-ignore
            onClick={() => onFlyToGathering?.(event.spaceId)}
          />
        )}
      </styled.Buttons>
    </styled.Buttons>
  );

  const info = () => (
    <styled.Info>
      <styled.Header>
        <Heading type="h1" align="left" label={event.title} transform="uppercase" />
        <Text text="/" size="xl" />
        <Text text={event.hosted_by} size="xl" transform="uppercase" />
      </styled.Header>
      <styled.Row>
        <styled.BaseInfo>
          {isWorldCalendar && (
            <Text
              text={`${t('eventList.eventItem.at')}: ${event.spaceName ?? ''}`}
              size="l"
              weight="bold"
              align="left"
            />
          )}
          <styled.DateRow>
            <Text
              text={`${event.startDateAndTime.split('-')[0]} -`}
              size="l"
              weight="bold"
              align="left"
            />
            <Text text={event.startDateAndTime.split('-')[1]} size="l" align="left" />
            <Text
              text={`${t('eventList.eventItem.to')} ${event.endDateAndTime}`}
              size="l"
              transform="uppercase"
              align="left"
            />
            <Text text={event.timeZone} size="l" align="left" />
          </styled.DateRow>
        </styled.BaseInfo>
      </styled.Row>
      <styled.TextRow>
        <ShowMoreText
          text={event.description}
          textProps={{
            size: 's',
            align: 'left',
            firstBoldSentences: 1,
            isCustom: true
          }}
          isCustom
        />
      </styled.TextRow>
      {buttons()}
      <styled.Actions>
        {onRemove && (
          <SvgButton
            iconName="bin"
            size="medium"
            onClick={() => {
              onRemove(event.id);
            }}
          />
        )}
        {onEdit && (
          <SvgButton
            iconName="edit"
            size="medium"
            onClick={() => {
              onEdit(event);
            }}
          />
        )}
      </styled.Actions>
    </styled.Info>
  );

  const image = () => (
    <styled.ImageContainer>
      {event.image_hash ? (
        <img alt={event.image_hash} src={`${endpoints.renderService}/get/${event.image_hash}`} />
      ) : (
        <img alt="placeholder" src="/img/events/placeholder.png" />
      )}
    </styled.ImageContainer>
  );

  return (
    <styled.Container style={{zIndex: zIndex}} id={event.id}>
      <styled.Row className="header">{image()}</styled.Row>
      {info()}
    </styled.Container>
  );
};

export default EventItem;
