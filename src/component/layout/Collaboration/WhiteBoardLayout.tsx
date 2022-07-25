import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {appVariables} from 'api/constants';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {IntegrationTypeEnum} from 'core/enums';

import {MiroBoard} from '../../../context/Collaboration/CollaborationTypes';
import {useOwner} from '../../../hooks/api/useOwner';
import 'core/utils/boardsPicker.1.0.js';
import Button from '../../atoms/Button';
import Panel from '../../atoms/Panel';
import Page from '../../molucules/Page';
import {
  useIntegrationEnable,
  useIntegrationFetch
} from '../../../context/Integration/hooks/useIntegration';

export interface WhiteBoardProps {}

const WhiteBoardLayout: React.FC<WhiteBoardProps> = () => {
  const [subPageTitle, setSubPageTitle] = useState<string>('');
  const {collaborationStore} = useStore();
  const {space} = collaborationStore;
  const [miroboard, , , refetch] = useIntegrationFetch(
    space.id?.toString() ?? '',
    IntegrationTypeEnum.MIRO
  );

  const [owner] = useOwner(space?.id || '');

  const [addMiroBoard] = useIntegrationEnable();
  const userIsInTeam = !!owner?.admin;
  const userIsTeamleader = !!owner?.admin;

  useEffect(() => {
    if (miroboard?.data?.name) {
      setSubPageTitle('Miro / ' + miroboard?.data?.name);
    } else {
      setSubPageTitle('Miro');
    }
  }, [miroboard]);

  usePosBusEvent('miro-board-change', (id) => {
    if (space?.id === id) {
      refetch();
    }
  });

  const pickBoard = useCallback(() => {
    if (space.id) {
      //@ts-ignore
      miroBoardsPicker.open({
        clientId: appVariables.MIRO_APP_ID,
        action: 'access-link',
        success: function (board: MiroBoard) {
          addMiroBoard({
            integrationType: IntegrationTypeEnum.MIRO,
            spaceId: space.id ?? '',
            data: board
          }).then(() => {
            refetch();
          });
        }
      });
    }
  }, [addMiroBoard, space, refetch]);

  const actions = useMemo(() => {
    if (userIsTeamleader) {
      return (
        <Button type="ghost" size="s" onClick={pickBoard}>
          change board
        </Button>
      );
    }
    return null;
  }, [pickBoard, userIsTeamleader]);

  const getView = () => {
    if (miroboard?.data?.accessLink) {
      return (
        <Panel grow={true} padding={false}>
          <iframe
            title="Miro board"
            width="800"
            height="500"
            className="w-full h-full"
            src={miroboard?.data?.accessLink}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
          />
        </Panel>
      );
    } else if (userIsTeamleader) {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">Your team does not have a Miro board yet</h2>
            <Button type="ghost" size="m" onClick={pickBoard}>
              Choose a Miro board
            </Button>
          </div>
        </Panel>
      );
    } else if (userIsInTeam) {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">Your team does not have a Miro board yet</h2>
            <p>Ask your teamleader to visit this page and connect your board</p>
          </div>
        </Panel>
      );
    } else {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">This team does not have a Miro board yet</h2>
          </div>
        </Panel>
      );
    }
  };

  return (
    <Page title={space.name || ''} subtitle={subPageTitle} actions={actions} collaboration>
      {getView()}
    </Page>
  );
};

export default WhiteBoardLayout;
