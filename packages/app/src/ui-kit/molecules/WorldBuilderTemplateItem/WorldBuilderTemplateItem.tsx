import React, {FC} from 'react';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';
import {Heading, SvgButton} from '@momentum/ui-kit';

import * as styled from './WorldBuilderTemplateItem.styled';

interface PropsInterface {
  name: string;
  description: string;
  imageSrc?: string;
  selected?: boolean;
  onClick?: () => void;
}

const WorldBuilderTemplateItem: FC<PropsInterface> = ({
  name,
  description,
  imageSrc,
  onClick,
  selected = false
}) => {
  const {t} = useTranslation();

  return (
    <styled.Container onClick={() => onClick?.()} className={cn(selected && 'selected')}>
      <styled.InfoContainer className={cn(selected && 'selected')}>
        <styled.InfoHeader className={cn(selected && 'selected')}>
          <Heading
            label={selected ? t('titles.templateNameWrapper', {name}) : name}
            type={selected ? 'h1' : 'h2'}
            transform="uppercase"
          />
          {!selected && <SvgButton iconName="info" size="medium-large" />}
        </styled.InfoHeader>
        <styled.Description
          text={description}
          size="m"
          isMultiline={selected}
          align="left"
          className={cn(selected && 'selected')}
        />
      </styled.InfoContainer>
      <styled.Image src={imageSrc} className={cn(selected && 'selected')} />
    </styled.Container>
  );
};

export default WorldBuilderTemplateItem;
