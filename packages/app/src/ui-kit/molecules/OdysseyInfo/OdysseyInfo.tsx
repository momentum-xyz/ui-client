import React, {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {IconSvg, Text, Button, Image} from '@momentum-xyz/ui-kit';

import {OdysseyItemInterface} from 'scenes/explore/stores';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './OdysseyInfo.styled';

interface PropsInterface {
  odyssey: OdysseyItemInterface | null;
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
  avatar?: string;
}

const OdysseyInfo: FC<PropsInterface> = ({
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
  dockDisabled,
  avatar = ''
}) => {
  const {t} = useTranslation();
  const image = avatar || odyssey?.image;

  return (
    <styled.OdysseyInfoContainer data-testid="OdysseyInfo-test">
      <styled.Container>
        <styled.TopContainer>
          <Image
            src={getImageAbsoluteUrl(image) || ''}
            sizeProps={{width: '90px', height: '90px'}}
            className="avatar"
          />
          <styled.Actions>
            {!!onVisit && (
              <Button
                size="small"
                label={t('actions.visit')}
                icon="fly-to"
                disabled={!!visitDisabled}
                onClick={onVisit}
              />
            )}
            {!!onHighFive && (
              <Button
                size="small"
                label={t('actions.highFive')}
                icon="high-five"
                disabled={!!highFiveDisabled}
                onClick={onHighFive}
              />
            )}
            {!!onConnect && (
              <Button
                size="small"
                label={t(`actions.${alreadyConnected ? 'connected' : 'connect'}`)}
                icon="hierarchy"
                disabled={!!connectDisabled}
                onClick={onConnect}
              />
            )}
            {!!onCoCreate && (
              <Button
                size="small"
                label={t('actions.coCreate')}
                icon="cubicles"
                disabled={!!coCreateDisabled}
                onClick={onCoCreate}
              />
            )}
            {!!onDock && (
              <Button
                size="small"
                label={t('actions.dock')}
                icon="people"
                disabled={!!dockDisabled}
                onClick={onDock}
              />
            )}
          </styled.Actions>
        </styled.TopContainer>
      </styled.Container>

      {odyssey && (
        <>
          {odyssey.description && (
            <styled.Description>
              <Text size="xxs" text={odyssey.description} align="left" />
            </styled.Description>
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
