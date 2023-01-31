import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useHistory} from 'react-router-dom';
import {ToolbarIcon, ToolbarIconInterface, Text, IconSvg} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';

import * as styled from './ToolbarCreatorIcon.styled';

interface PropsInterface {
  worldId: string;
  isAdmin: boolean;
  isBuilderMode: boolean;
}

const ToolbarCreatorIcon: FC<PropsInterface> = (props) => {
  const {worldId, isAdmin, isBuilderMode} = props;

  const history = useHistory();
  const {t} = useTranslation();

  const collapsedItem: ToolbarIconInterface = {
    icon: 'planet',
    size: 'medium',
    title: t('actions.creatorOpen'),
    onClick: () => history.push(generatePath(ROUTES.odyssey.creator.base, {worldId}))
  };

  const expandedItems: ToolbarIconInterface[] = [
    {
      icon: 'close',
      size: 'medium',
      title: t('actions.creatorClose'),
      onClick: () => history.push(generatePath(ROUTES.odyssey.base, {worldId}))
    }
  ];

  if (isBuilderMode) {
    return (
      <styled.ActiveIconsContainer>
        <styled.ActiveIcons>
          {expandedItems.map((item) => (
            <ToolbarIcon key={item.title} {...item} />
          ))}
        </styled.ActiveIcons>

        <styled.StandoutBuilderModeContainer>
          <IconSvg name="planet" size="large" />
          <Text
            size="xxs"
            text={t('titles.creatorEnabled')}
            transform="uppercase"
            isMultiline={false}
          />
        </styled.StandoutBuilderModeContainer>
      </styled.ActiveIconsContainer>
    );
  }

  return <ToolbarIcon {...collapsedItem} disabled={!isAdmin} />;
};

export default ToolbarCreatorIcon;
