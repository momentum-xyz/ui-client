import React, {FC, useEffect, useRef} from 'react';

import {WorldBuilderTemplateModelInterface} from 'scenes/worldBuilder/stores/WorldBuilderTemplatesStore/models';
import {Heading, SvgButton} from 'ui-kit';
import {appVariables} from 'api/constants';

import * as styled from './WorldBuilderTemplateItem.styled';

interface PropsInterface {
  template: WorldBuilderTemplateModelInterface;
  onClick?: (template: WorldBuilderTemplateModelInterface) => void;
}

const WorldBuilderTemplateItem: FC<PropsInterface> = ({template, onClick}) => {
  const ref = useRef(null);

  useEffect(() => {
    console.info(template.id === template.image);
  }, [template.id, template.image]);

  return (
    <styled.Container ref={ref} onClick={() => onClick?.(template)}>
      <styled.InfoContainer>
        <styled.InfoHeader>
          <Heading label={template.name} type="h2" transform="uppercase" />
          <SvgButton iconName="info" size="medium-large" />
        </styled.InfoHeader>
        <styled.Description text={template.description} size="m" isMultiline={false} align="left" />
      </styled.InfoContainer>
      <styled.Image src={`${appVariables.RENDER_SERVICE_URL}/get/${template.image}`} />
    </styled.Container>
  );
};

export default WorldBuilderTemplateItem;
