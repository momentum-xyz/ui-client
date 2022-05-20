import React, {FC} from 'react';
import {t} from 'i18next';
import AddToCalendarHOC, {SHARE_SITES} from 'react-add-to-calendar-hoc';

import {EventItemModelInterface} from 'core/models/EventItem';
import {AddToCalendarDropdown, Button, IconSvg, ShowMoreText, SvgButton, Text} from 'ui-kit';
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
            label={`${t('eventList.eventItem.flyToSpace')} ${
              event.spaceName && event.spaceName.slice(0, 12)
            } ${event.spaceName && (event.spaceName.length > 12 ? '...' : '')}`}
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
            icon="fly-to"
            label={t('eventList.eventItem.joinGathering')}
            // @ts-ignore
            onClick={() => onFlyToGathering?.(event.spaceId)}
          />
        )}
      </styled.Buttons>
    </styled.Buttons>
  );

  const header = () => (
    <styled.Header>
      {isWorldCalendar ? (
        <styled.WorldHeader>
          <styled.BoldHeader>{event.spaceName ?? ''}</styled.BoldHeader>
          <styled.BoldHeader> / </styled.BoldHeader>
          <styled.BoldHeader className="notBold">{event.title}</styled.BoldHeader>
          <styled.BoldHeader className="notBold"> / </styled.BoldHeader>
          <styled.NormalHeader>{event.hosted_by}</styled.NormalHeader>
        </styled.WorldHeader>
      ) : (
        <styled.SpaceHeader>
          <styled.BoldHeader>{event.title}</styled.BoldHeader>
          <styled.BoldHeader className="notBold"> / </styled.BoldHeader>
          <styled.NormalHeader>{event.hosted_by}</styled.NormalHeader>
        </styled.SpaceHeader>
      )}
    </styled.Header>
  );

  const date = () => (
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
    </styled.DateRow>
  );

  const actions = () => (
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
  );

  const info = () => (
    <styled.Div>
      {header()}
      {date()}
      <styled.Info>
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
        {actions()}
      </styled.Info>
    </styled.Div>
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
