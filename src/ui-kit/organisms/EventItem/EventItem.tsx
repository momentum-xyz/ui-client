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
        {!!event.web_link && (
          <Button
            label={t('eventList.eventItem.websiteLink')}
            icon="link"
            // @ts-ignore
            onClick={() => onWeblinkClick(event.web_link)}
          />
        )}
        <Button
          onClick={() => {
            onMagicLinkOpen(event.id, event.spaceId ?? undefined);
          }}
          label={t('eventList.eventItem.gatheringLink')}
          icon="location"
        />
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
      <styled.Row>
        <styled.BaseInfo>
          <Text
            text={`${t('eventList.eventItem.by')}: ${event.hosted_by}`}
            size="l"
            weight="bold"
            align="left"
          />
          {isWorldCalendar && (
            <Text
              text={`${t('eventList.eventItem.at')}: ${event.spaceName ?? ''}`}
              size="l"
              weight="bold"
              align="left"
            />
          )}
          <Text
            text={`${t('eventList.eventItem.from')}: ${event.startDateAndTime}`}
            size="l"
            weight="bold"
            align="left"
          />
          <Text
            text={`${t('eventList.eventItem.to')}: ${event.endDateAndTime}`}
            size="l"
            weight="bold"
            align="left"
          />
          <Text text={event.timeZone} size="l" weight="bold" align="left" />
        </styled.BaseInfo>
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
      </styled.Row>
      {buttons()}
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
      <styled.Row className="header">
        <Heading type="h1" align="left" label={event.title} transform="uppercase" />
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
      </styled.Row>
      <styled.Row className="body">
        {image()}
        {info()}
      </styled.Row>
    </styled.Container>
  );
};

export default EventItem;
