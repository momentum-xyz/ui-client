import React, {FC, useCallback, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';

import {appVariables} from 'api/constants';
import {usePosBusEvent, useStore} from 'shared/hooks';
// TODO: Refactoring
import Button from 'component/atoms/Button';
import Panel from 'component/atoms/Panel';
import Page from 'component/molucules/Page';

import 'core/utils/boardsPicker.1.0.js';

const MiroBoardPage: FC = () => {
  const {collaborationStore} = useStore();
  const {spaceStore, miroBoardStore} = collaborationStore;
  const {space, isAdmin} = spaceStore;
  const {miroBoard, miroBoardTitle} = miroBoardStore;

  usePosBusEvent('miro-board-change', (id) => {
    if (space?.id === id && space?.id) {
      miroBoardStore.fetchMiroBoard(space.id);
    }
  });

  useEffect(() => {
    if (space?.id) {
      miroBoardStore.fetchMiroBoard(space.id);
    }
  }, [miroBoardStore, space.id]);

  const enableIntegration = useCallback(
    async (data) => {
      if (space?.id) {
        await miroBoardStore.enableMiroBoard(space.id, data);
        await miroBoardStore.fetchMiroBoard(space.id);
      }
    },
    [miroBoardStore, space.id]
  );

  const pickBoard = useCallback(() => {
    if (space?.id) {
      // @ts-ignore: js-variable
      miroBoardsPicker.open({
        action: 'access-link',
        clientId: appVariables.MIRO_APP_ID,
        success: enableIntegration
      });
    }
  }, [enableIntegration, space?.id]);

  const actions = useMemo(() => {
    if (isAdmin) {
      return (
        <Button type="ghost" size="s" onClick={pickBoard}>
          change board
        </Button>
      );
    }
    return null;
  }, [pickBoard, isAdmin]);

  const getView = () => {
    if (miroBoard?.data?.accessLink) {
      return (
        <Panel grow={true} padding={false}>
          <iframe
            title="Miro board"
            width="800"
            height="500"
            className="w-full h-full"
            src={miroBoard?.data?.accessLink}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
          />
        </Panel>
      );
    } else if (isAdmin) {
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
    <Page title={space?.name || ''} subtitle={miroBoardTitle} actions={actions} collaboration>
      {getView()}
    </Page>
  );
};

export default observer(MiroBoardPage);
