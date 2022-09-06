import React, {FC} from 'react';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {WorldBuilderTemplateModelInterface} from 'scenes/worldBuilder/stores/WorldBuilderTemplatesStore/models';
import {Heading, SvgButton} from 'ui-kit';

import * as styled from './WorldBuilderTemplateItem.styled';

interface PropsInterface {
  template: WorldBuilderTemplateModelInterface;
  selected?: boolean;
  onClick?: (template: WorldBuilderTemplateModelInterface) => void;
}

const WorldBuilderTemplateItem: FC<PropsInterface> = ({template, onClick, selected = false}) => {
  const {t} = useTranslation();

  return (
    <styled.Container onClick={() => onClick?.(template)} className={cn(selected && 'selected')}>
      <styled.InfoContainer className={cn(selected && 'selected')}>
        <styled.InfoHeader className={cn(selected && 'selected')}>
          <Heading
            label={
              selected ? t('titles.templateNameWrapper', {name: template.name}) : template.name
            }
            type={selected ? 'h1' : 'h2'}
            transform="uppercase"
          />
          {!selected && <SvgButton iconName="info" size="medium-large" />}
        </styled.InfoHeader>
        <styled.Description
          text={template.description}
          size="m"
          isMultiline={selected}
          align="left"
          className={cn(selected && 'selected')}
        />
      </styled.InfoContainer>
      <styled.Image src={template.imageSrc} className={cn(selected && 'selected')} />
    </styled.Container>
  );
};

export default WorldBuilderTemplateItem;
