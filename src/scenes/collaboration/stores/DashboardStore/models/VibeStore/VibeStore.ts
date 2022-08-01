import {flow, types} from 'mobx-state-tree';

import {RequestModel, ResetModel} from 'core/models';
import {VibeActionEnum} from 'core/enums';
import {api, VibeCountResponse} from 'api';

const VibeStore = types.compose(
  ResetModel,
  types
    .model('VibeStore', {
      checkVibeRequest: types.optional(RequestModel, {}),
      countVibeRequest: types.optional(RequestModel, {}),
      toggleVibeRequest: types.optional(RequestModel, {}),
      canVibe: false,
      vibeCount: 0
    })
    .actions((self) => ({
      check: flow(function* (spaceId: string) {
        const response = yield self.checkVibeRequest.send(api.vibeRepository.checkVibe, {
          spaceId
        });
        if (response) {
          self.canVibe = response;
        }

        return self.checkVibeRequest.isDone;
      }),
      count: flow(function* (spaceId: string) {
        const response: VibeCountResponse = yield self.countVibeRequest.send(
          api.vibeRepository.countVibe,
          {
            spaceId
          }
        );
        if (response) {
          self.vibeCount = response.count;
        }
        return self.countVibeRequest.isDone;
      }),
      toggle: flow(function* (spaceId: string) {
        yield self.toggleVibeRequest.send(api.vibeRepository.toggleVibe, {
          spaceId,
          vibeAction: self.canVibe ? VibeActionEnum.INCREASE : VibeActionEnum.DECREASE
        });

        return self.toggleVibeRequest.isDone;
      }),
      setCount(count: number) {
        self.vibeCount = count;
      },
      toggleVibe() {
        self.canVibe = !self.canVibe;
      }
    }))
);

export {VibeStore};
