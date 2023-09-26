import {cast, flow, Instance, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, WorldMemberInterface} from 'api';

const WorldMembers = types.compose(
  ResetModel,
  types
    .model('WorldMembers', {
      worldId: types.string,

      members: types.optional(types.array(types.frozen<WorldMemberInterface>()), []),
      requestMembers: types.optional(RequestModel, {}),
      addMemberRequest: types.optional(RequestModel, {}),
      deleteMemberRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      fetchMembers: flow(function* () {
        const response: WorldMemberInterface[] = yield self.requestMembers.send(
          api.objectRepository.fetchWorldMembers,
          {
            worldId: self.worldId
          }
        );

        if (response) {
          self.members = cast(response);
        }
      })
    }))
    .actions((self) => ({
      addMember: flow(function* (address: string, role = 'admin') {
        yield self.addMemberRequest.send(api.objectRepository.addWorldMember, {
          worldId: self.worldId,
          address,
          role
        });

        if (self.addMemberRequest.isError) {
          throw new Error(self.addMemberRequest.errorCode?.toString());
        }

        yield self.fetchMembers();
      }),
      deleteMember: flow(function* (userId: string) {
        yield self.deleteMemberRequest.send(api.objectRepository.deleteWorldMember, {
          worldId: self.worldId,
          userId
        });

        if (self.deleteMemberRequest.isError) {
          throw new Error(self.deleteMemberRequest.errorCode?.toString());
        }

        yield self.fetchMembers();
      })
    }))
);

export type WorldMembersModelType = Instance<typeof WorldMembers>;

export {WorldMembers};
