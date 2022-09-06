import React, {FC, useRef} from 'react';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {WorldBuilderTemplateModelInterface} from 'scenes/worldBuilder/stores/WorldBuilderTemplatesStore/models';
import {Heading, SvgButton} from 'ui-kit';
import {appVariables} from 'api/constants';

import * as styled from './WorldBuilderTemplateItem.styled';

interface PropsInterface {
  template: WorldBuilderTemplateModelInterface;
  selected?: boolean;
  onClick?: (template: WorldBuilderTemplateModelInterface) => void;
}

const WorldBuilderTemplateItem: FC<PropsInterface> = ({template, onClick, selected = false}) => {
  const ref = useRef(null);

  const {t} = useTranslation();

  return (
    <styled.Container
      ref={ref}
      onClick={() => onClick?.(template)}
      className={cn(selected && 'selected')}
    >
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
      <styled.Image
        src={`${appVariables.RENDER_SERVICE_URL}/get/${template.image}`}
        className={cn(selected && 'selected')}
      />
    </styled.Container>
  );
};

export default WorldBuilderTemplateItem;
