import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {Universe3dEmitter, useI18n} from '@momentum-xyz/core';
import {
  Panel,
  Hexagon,
  IconSvg,
  SymbolAmount,
  ButtonEllipse,
  ImageSizeEnum,
  PositionEnum
} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {formatBigInt, getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo} from 'ui-kit';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import * as styled from './WorldDetailsWidget.styled';

const USERS_MAX = 2;

const WorldDetailsWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {worldDetailsStore} = widgetStore;
  const {worldDetails} = worldDetailsStore;

  const [isButtonShown, setIsButtonShown] = useState(false);

  const {t} = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.id) {
      Universe3dEmitter.emit('WorldSelected', data.id.toString());
      worldDetailsStore.init(data.id.toString());
    }

    return () => {
      worldDetailsStore.resetModel();
    };
  }, [worldDetailsStore, data?.id]);

  useEffect(() => {
    const stakersCount = worldDetails?.world?.stakers?.length || 0;
    setIsButtonShown(stakersCount > USERS_MAX);
  }, [worldDetails?.world?.stakers?.length]);

  const onSelectUser = (userId: string) => {
    widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id: userId});
  };

  const onVisitWorld = (worldId: string) => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  const onStakeWorld = (worldId: string) => {
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
  };

  if (!worldDetails?.world) {
    return <></>;
  }

  const {world} = worldDetails;
  const {stakers} = world;

  return (
    <styled.Container data-testid="WorldDetailsWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="rabbit_fill"
        variant="primary"
        title={t('labels.odysseyOverview')}
        image={getImageAbsoluteUrl(world?.avatarHash, ImageSizeEnum.S3)}
        onClose={() => widgetManagerStore.close(WidgetEnum.WORLD_DETAILS)}
      >
        <styled.Wrapper>
          <ProfileImage
            name={world.name || world.id}
            image={world.avatarHash}
            imageErrorIcon="rabbit_fill"
            byName={world.owner_name || ''}
            onByClick={() => onSelectUser(world.owner_id)}
          />

          <styled.GeneralScrollable>
            <ProfileInfo
              description={world.description}
              joinDate={world.createdAt}
              onVisit={() => onVisitWorld(world.id)}
              onStake={() => onStakeWorld(world.id)}
            />

            <styled.TitleContainer>
              <styled.Title>
                <IconSvg name="stake" size="xs" isWhite />
                <span>{t('labels.staked')}</span>
              </styled.Title>
            </styled.TitleContainer>

            <styled.TotalAmount>
              <div>{t('labels.totalAmountStaked')}:</div>
              <SymbolAmount stringValue={formatBigInt(world.momStaked)} tokenSymbol="MOM" />
            </styled.TotalAmount>

            {!!world.last_staking_comment && (
              <styled.StakingCommentContainer>
                <div>{t('labels.lastStakingComment')}:</div>
                <styled.StakingComment>{world.last_staking_comment}</styled.StakingComment>
              </styled.StakingCommentContainer>
            )}

            {stakers && (stakers?.length || 0) > 0 && (
              <styled.StakedInUsersContainer>
                <styled.Title>
                  <IconSvg name="connect" size="xs" isWhite />
                  <span>{t('labels.connections')}</span>
                </styled.Title>

                {(isButtonShown ? stakers.slice(0, USERS_MAX) : stakers).map((user, index) => {
                  const username = user.name || user.user_id;
                  return (
                    <styled.StakedInUser
                      key={user.user_id}
                      onClick={() => onSelectUser(user.user_id)}
                    >
                      <Hexagon
                        type="fourth-borderless"
                        skipOuterBorder
                        imageSrc={user.avatarHash}
                      />
                      <styled.Link>
                        {index < USERS_MAX ? `${t('labels.topConnector')}: ${username}` : username}
                      </styled.Link>
                    </styled.StakedInUser>
                  );
                })}

                {isButtonShown && (
                  <styled.ShowAllButtonContainer>
                    <ButtonEllipse
                      label={t('actions.seeAll')}
                      onClick={() => setIsButtonShown(false)}
                    />
                  </styled.ShowAllButtonContainer>
                )}
              </styled.StakedInUsersContainer>
            )}
          </styled.GeneralScrollable>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(WorldDetailsWidget);
