import React from 'react';
import {generatePath, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import DraggableContent from 'react-draggable';
import {IconSvg, Portal, Text} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {Stage} from 'ui-kit';

import * as styled from './StageModePIPWidget.styled';

// It's a hack, won't work without it
const Draggable: any = DraggableContent;

const StageModePIPWidget: React.FC = () => {
  const {agoraStore_OLD} = useStore();

  const navigate = useNavigate();
  const {t} = useTranslation();

  if (!agoraStore_OLD.isStageMode) {
    return null;
  }

  return (
    <Portal>
      <Draggable>
        <styled.Container title={t('titles.goToStageMode')} data-testid="StageModePIPWidget-test">
          <Stage />
          <styled.HeaderElement className="left">
            <Text text={t('messages.onStage')} size="xs" weight="bold" transform="uppercase" />
          </styled.HeaderElement>
          <styled.HeaderElement
            className="right"
            onClick={() => {
              navigate(
                generatePath(ROUTES.collaboration.stageMode, {spaceId: agoraStore_OLD.spaceId})
              );
            }}
          >
            <IconSvg name="fullscreen" size="normal" />
          </styled.HeaderElement>
        </styled.Container>
      </Draggable>
    </Portal>
  );
};

export default observer(StageModePIPWidget);
