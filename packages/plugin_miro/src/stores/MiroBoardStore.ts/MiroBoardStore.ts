import {ResetModel} from '@momentum-xyz/core';
import {appVariables} from 'api/constants';
import {MiroApiInterface, MiroBoardInterface} from 'core/interfaces';
import {flow, types} from 'mobx-state-tree';

const MiroBoardStore = types
  .compose(
    ResetModel,
    types.model('MiroBoardStore', {
      api: types.maybe(types.frozen<MiroApiInterface>()),
      board: types.maybeNull(types.frozen<MiroBoardInterface>())
    })
  )
  .actions((self) => ({
    init(api: MiroApiInterface) {
      self.api = api;
    },
    fetchBoard: flow(function* () {
      if (!self.api) {
        return;
      }

      self.board = yield self.api.getItem<MiroBoardInterface | null>('board');
    })
  }))
  .actions((self) => ({
    onBoardPickSuccess: flow(function* (data: MiroBoardInterface) {
      if (!self.api) {
        return;
      }

      yield self.api.setItem('board', data);
    }),
    pickBoard() {
      miroBoardsPicker.open({
        action: 'access-link',
        clientId: appVariables.MIRO_APP_ID,
        success: this.onBoardPickSuccess
      });
    },
    disableBoard: flow(function* () {
      if (!self.api) {
        return;
      }

      self.board = yield self.api.deleteItem('board');
    }),
    handleBoardChange(board: MiroBoardInterface) {
      self.board = board;
    },
    handleBoardRemove() {
      self.board = null;
    }
  }));

export {MiroBoardStore};
