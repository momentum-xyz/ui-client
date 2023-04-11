import {FC} from 'react';
import cn from 'classnames';
import {useI18n} from '@momentum-xyz/core';
import {Image, ButtonEllipse, IconNameType, ImageSizeEnum} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './ItemCard.styled';

interface PropsInterface {
  variant?: 'small' | 'normal';
  name: string;
  description?: string | null;
  byName?: string;
  image?: string | null;
  imageHeight?: number;
  imageErrorIcon: IconNameType;
  onByNameClick?: () => void;
  onInfoClick?: () => void;
  onVisitClick?: () => void;
  onStakeClick?: () => void;
}

const ItemCard: FC<PropsInterface> = ({
  variant = 'normal',
  name,
  description,
  byName,
  image,
  imageHeight,
  imageErrorIcon,
  onByNameClick,
  onInfoClick,
  onVisitClick,
  onStakeClick
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="ItemCard-test" className={cn(variant)}>
      <Image
        src={getImageAbsoluteUrl(image, ImageSizeEnum.S5)}
        errorIcon={imageErrorIcon}
        height={imageHeight}
        onClick={onInfoClick}
      />
      <styled.ItemContent className={cn(variant)}>
        <styled.ItemNameContainer>
          <styled.ItemName className={cn(variant)}>{name}</styled.ItemName>
          {byName && (
            <span>
              {`${t('labels.by')}: `}
              <styled.ItemLink onClick={onByNameClick}>{byName}</styled.ItemLink>
            </span>
          )}
        </styled.ItemNameContainer>
        {!!description && <styled.ItemDesc className={cn(variant)}>{description}</styled.ItemDesc>}

        <styled.Actions>
          {!!onInfoClick && (
            <ButtonEllipse label={t('actions.info')} icon="info_2" onClick={onInfoClick} />
          )}
          {!!onVisitClick && (
            <ButtonEllipse label={t('actions.visit')} icon="fly-to" onClick={onVisitClick} />
          )}
          {!!onStakeClick && (
            <ButtonEllipse label={t('actions.stake')} icon="stake" onClick={onStakeClick} />
          )}
        </styled.Actions>
      </styled.ItemContent>
    </styled.Wrapper>
  );
};

export default ItemCard;
