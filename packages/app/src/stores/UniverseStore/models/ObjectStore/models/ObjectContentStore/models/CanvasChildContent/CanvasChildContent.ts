import {cast, flow, types} from 'mobx-state-tree';
import {v4 as uuidv4} from 'uuid';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {User} from 'core/models';
import {PluginIdEnum} from 'api/enums';
import {UserContributionInterface} from 'api/interfaces';
import {ObjectCommentInterface, ObjectCommentWithUserInterface} from 'core/interfaces';
import {api, GetSpaceUserAttributeCountResponse, GetAllSpaceUserAttributeListResponse} from 'api';

const COMMENTS_PAGE_SIZE = 100;

const CanvasChildContent = types
  .compose(
    ResetModel,
    types.model('CanvasChildContent', {
      pluginId: '',
      objectId: '',
      ownerId: '',

      author: types.maybe(User),
      content: types.maybe(types.frozen<UserContributionInterface>()),

      voteCount: 0,
      hasVote: false,

      commentList: types.optional(types.array(types.frozen<ObjectCommentWithUserInterface>()), []),

      fetchRequest: types.optional(RequestModel, {}),
      authorRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {}),
      voteRequest: types.optional(RequestModel, {}),
      voteCountRequest: types.optional(RequestModel, {}),
      commentRequest: types.optional(RequestModel, {}),
      commentListRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    initContent: flow(function* (pluginId: string, objectId: string, ownerId: string) {
      self.pluginId = pluginId;
      self.objectId = objectId;
      self.ownerId = ownerId;

      const attributeResponse: UserContributionInterface = yield self.fetchRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          userId: self.ownerId,
          spaceId: self.objectId,
          pluginId: self.pluginId,
          attributeName: AttributeNameEnum.CANVAS_CONTRIBUTION
        }
      );

      if (attributeResponse) {
        self.content = attributeResponse;
      }

      if (self.ownerId) {
        const authorResponse = yield self.authorRequest.send(api.userRepository.fetchUser, {
          userId: self.ownerId
        });

        if (authorResponse) {
          self.author = cast(authorResponse);
        }
      }
    }),
    fetchContent(): void {
      this.initContent(self.pluginId, self.objectId, self.ownerId);
    }
  }))
  .actions((self) => ({
    deleteObject: flow(function* () {
      yield self.deleteRequest.send(api.objectRepository.deleteObject, {
        objectId: self.objectId
      });

      return self.deleteRequest.isDone;
    })
  }))
  .actions((self) => ({
    fetchVoteCount: flow(function* () {
      const response: GetSpaceUserAttributeCountResponse = yield self.voteCountRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttributeCount,
        {
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.VOTE
        }
      );

      self.voteCount = response ? response.count : 0;
    }),
    checkVote: flow(function* (userId: string) {
      const response = yield self.voteRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          userId: userId,
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.VOTE
        }
      );

      self.hasVote = !!response;
    }),
    async toggleVote(userId: string) {
      if (self.hasVote) {
        await this.removeVote(userId);
      } else {
        await this.addVote(userId);
      }

      this.fetchVoteCount();
    },
    addVote: flow(function* (userId: string) {
      yield self.voteRequest.send(api.spaceUserAttributeRepository.setSpaceUserAttribute, {
        userId: userId,
        spaceId: self.objectId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOTE,
        value: {}
      });

      if (self.voteRequest.isDone) {
        self.hasVote = true;
      }
    }),
    removeVote: flow(function* (userId: string) {
      yield self.voteRequest.send(api.spaceUserAttributeRepository.deleteSpaceUserAttribute, {
        userId: userId,
        spaceId: self.objectId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.VOTE
      });

      if (self.voteRequest.isDone) {
        self.hasVote = false;
      }
    })
  }))
  .actions((self) => ({
    async fetchAllComments(startIndex: number) {
      const hasMoreItems = await this.fetchComments(startIndex);
      if (hasMoreItems) {
        this.fetchAllComments(self.commentList.length);
      }
    },
    fetchComments: flow(function* (startIndex: number) {
      if (startIndex === 0) {
        self.commentList = cast([]);
      }

      const response: GetAllSpaceUserAttributeListResponse = yield self.commentListRequest.send(
        api.spaceUserAttributeRepository.getAllSpaceUserAttributeList,
        {
          spaceId: self.objectId,
          pluginId: PluginIdEnum.CORE,
          attributeName: AttributeNameEnum.COMMENTS,
          orderDirection: 'DESC',
          // Fields of ObjectCommentInterface
          fields: ['uuid', 'created', 'content'],
          order: 'created',
          limit: COMMENTS_PAGE_SIZE,
          offset: startIndex
        }
      );

      if (response) {
        const {items, count} = response;
        const commentList = items ? (items as ObjectCommentWithUserInterface[]) : [];
        self.commentList = cast([...self.commentList, ...commentList]);
        return count > self.commentList.length;
      }

      return false;
    }),
    addComment: flow(function* (userId: string, comment: string) {
      const uuid: string = uuidv4();
      const value: ObjectCommentInterface = {
        uuid: uuid,
        created: new Date().toISOString(),
        content: comment
      };

      yield self.commentRequest.send(api.spaceUserAttributeRepository.setSpaceUserSubAttribute, {
        userId: userId,
        spaceId: self.objectId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.COMMENTS,
        sub_attribute_key: uuid,
        sub_attribute_value: value
      });
    }),
    deleteComment: flow(function* (userId: string, commentId: string) {
      yield self.commentRequest.send(api.spaceUserAttributeRepository.deleteSpaceUserSubAttribute, {
        userId: userId,
        spaceId: self.objectId,
        pluginId: PluginIdEnum.CORE,
        attributeName: AttributeNameEnum.COMMENTS,
        sub_attribute_key: commentId
      });
    })
  }))
  .actions((self) => ({
    async initSocial(userId: string) {
      await self.fetchVoteCount();
      await self.checkVote(userId);
      await self.fetchAllComments(0);
    }
  }))
  .views((self) => ({
    get isLoading(): boolean {
      return self.fetchRequest.isPending || self.authorRequest.isPending;
    }
  }));

export {CanvasChildContent};
