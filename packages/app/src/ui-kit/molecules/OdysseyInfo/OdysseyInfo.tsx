import React, {FC, memo} from 'react';
import {IconSvg, Text, Button, Image} from '@momentum-xyz/ui-kit';
import {absoluteLink, registrationDateString, withoutProtocol, useI18n} from '@momentum-xyz/core';

import {getImageAbsoluteUrl} from 'core/utils';
import {UserModelInterface, NftItemStatsModelInterface} from 'core/models';

import * as styled from './OdysseyInfo.styled';

interface PropsInterface {
  user: UserModelInterface | null;
  odyssey: NftItemStatsModelInterface | null;
  alreadyConnected?: boolean;
  onVisit?: () => void;
  onHighFive?: () => void;
  onConnect?: () => void;
  onCoCreate?: () => void;
  onDock?: () => void;
  visitDisabled?: boolean;
  connectDisabled?: boolean;
  coCreateDisabled?: boolean;
  highFiveDisabled?: boolean;
  dockDisabled?: boolean;
}

const OdysseyInfo: FC<PropsInterface> = ({
  user,
  odyssey,
  alreadyConnected,
  onVisit,
  onHighFive,
  onConnect,
  onCoCreate,
  onDock,
  visitDisabled,
  connectDisabled,
  coCreateDisabled,
  highFiveDisabled,
  dockDisabled
}) => {
  const {t} = useI18n();

  return (
    <styled.OdysseyInfoContainer data-testid="OdysseyInfo-test">
      <styled.Container>
        <styled.TopContainer>
          <Image
            src={getImageAbsoluteUrl(odyssey?.image) || ''}
            sizeProps={{width: '80px', height: '80px'}}
          />
          <styled.Actions>
            {!!onVisit && (
              <Button
                size="small"
                label={t('actions.visit')}
                icon="fly-portal"
                noWhitespaceWrap
                disabled={!!visitDisabled}
                onClick={onVisit}
              />
            )}
            {!!onHighFive && (
              <Button
                size="small"
                label={t('actions.highFive')}
                icon="high-five"
                noWhitespaceWrap
                disabled={!!highFiveDisabled}
                onClick={onHighFive}
              />
            )}
            {!!onConnect && (
              <Button
                size="small"
                label={t(`actions.${alreadyConnected ? 'connected' : 'connect'}`)}
                icon="hierarchy"
                noWhitespaceWrap
                disabled={!!connectDisabled}
                onClick={onConnect}
              />
            )}
            {!!onCoCreate && (
              <Button
                size="small"
                label={t('actions.coCreate')}
                icon="cubicles"
                noWhitespaceWrap
                disabled={!!coCreateDisabled}
                onClick={onCoCreate}
              />
            )}
            {!!onDock && (
              <Button
                size="small"
                label={t('actions.dock')}
                icon="people"
                noWhitespaceWrap
                disabled={!!dockDisabled}
                onClick={onDock}
              />
            )}
          </styled.Actions>
        </styled.TopContainer>
      </styled.Container>

      {odyssey && (
        <>
          {user && (
            <styled.Info>
              {user.profile?.bio && (
                <Text text={user.profile.bio} size="xxs" align="left" breakLongWord />
              )}

              {user.profile?.profileLink && (
                <styled.InfoItem>
                  <IconSvg name="link" size="normal" />
                  <styled.Link href={absoluteLink(user.profile.profileLink)} target="_blank">
                    {withoutProtocol(user.profile.profileLink)}
                  </styled.Link>
                </styled.InfoItem>
              )}

              <styled.InfoItem>
                <IconSvg name="astro" size="normal" />
                <Text
                  size="xxs"
                  text={`${t('actions.joined')} ${registrationDateString(user.createdAt)}`}
                  isMultiline={false}
                />
              </styled.InfoItem>
            </styled.Info>
          )}

          <styled.Statistics>{t('titles.statistics')}</styled.Statistics>

          <styled.StatisticsData>
            <styled.StatisticsItem>
              <IconSvg name="hierarchy" size="medium" />
              <styled.StatisticsValue>
                {t('staking.connectionAmount', {connections: odyssey.connections})}
              </styled.StatisticsValue>
            </styled.StatisticsItem>
            <styled.StatisticsItem>
              <IconSvg name="people" size="medium" />
              <styled.StatisticsValue>
                {t('staking.dockingAmount', {docking: odyssey.docking})}
              </styled.StatisticsValue>
            </styled.StatisticsItem>
            <styled.StatisticsItem>
              <IconSvg name="calendar" size="medium" />
              <styled.StatisticsValue>
                {t('staking.eventAmount', {events: odyssey.events})}
              </styled.StatisticsValue>
            </styled.StatisticsItem>
          </styled.StatisticsData>
        </>
      )}
    </styled.OdysseyInfoContainer>
  );
};

export default memo(OdysseyInfo);
