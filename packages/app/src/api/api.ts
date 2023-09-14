import * as versionRepository from './repositories/versionRepository';
import * as configRepository from './repositories/configRepository';
import * as authRepository from './repositories/authRepository';
import * as web3Repository from './repositories/web3Repository';
import * as userRepository from './repositories/userRepository';
import * as worldRepository from './repositories/worldRepository';
import * as userProfileRepository from './repositories/userProfileRepository';
import * as pluginsRepository from './repositories/pluginsRepository';
import * as objectAttributeRepository from './repositories/objectAttributeRepository';
import * as userAttributeRepository from './repositories/userAttributeRepository';
import * as mediaRepository from './repositories/mediaRepository';
import * as newsfeedRepository from './repositories/newsfeedRepository';
import * as timelineRepository from './repositories/timelineRepository';
import * as emojiRepository from './repositories/emojiRepository';
import * as eventsRepository from './repositories/eventsRepository';
import * as objectInfoRepository from './repositories/objectInfoRepository';
import * as assets2dRepository from './repositories/assets2dRepository';
import * as objectRepository from './repositories/objectRepository';
import * as assets3dRepository from './repositories/assets3dRepository';
import * as agoraRepository from './repositories/agoraRepository';
import * as streamChatRepository from './repositories/streamChatRepository';
import * as objectUserAttributeRepository from './repositories/objectUserAttributeRepository';
import * as skyboxRepository from './repositories/skyboxRepository';
import * as aiImagesRepository from './repositories/aiImagesRepository';
import * as canvasRepository from './repositories/canvasRepository';

/**
 * This layer is responsible for:
 * - communicating with backend
 * - keeping declarations of API contracts
 * - creating adapters for data to ensure stability of data structures
 */

/**
 * An object containing methods for requests from/to our backend API
 */
export const api = {
  versionRepository,
  configRepository,
  authRepository,
  web3Repository,
  worldRepository,
  userRepository,
  userProfileRepository,
  agoraRepository,
  streamChatRepository,
  pluginsRepository,
  objectAttributeRepository,
  userAttributeRepository,
  objectUserAttributeRepository,
  mediaRepository,
  newsfeedRepository,
  timelineRepository,
  emojiRepository,
  eventsRepository,
  objectInfoRepository,
  assets2dRepository,
  objectRepository,
  skyboxRepository,
  aiImagesRepository,
  assets3dRepository,
  canvasRepository
};

/**
 * Re-exports of related types
 *
 * Types can include Request and Response namespaces
 * This is a contract between API and frontend
 */
export * from './repositories/versionRepository/versionRepository.api.types';
export * from './repositories/configRepository/configRepository.api.types';
export * from './repositories/authRepository/authRepository.api.types';
export * from './repositories/web3Repository/web3Repository.api.types';
export * from './repositories/userRepository/userRepository.api.types';
export * from './repositories/userProfileRepository/userProfileRepository.api.types';
export * from './repositories/worldRepository/worldRepository.api.types';
export * from './repositories/pluginsRepository/pluginsRepository.api.types';
export * from './repositories/objectAttributeRepository/objectAttribute.api.types';
export * from './repositories/userAttributeRepository/userAttributeRepository.api.types';
export * from './repositories/mediaRepository/mediaRepository.api.types';
export * from './repositories/newsfeedRepository/newsfeedRepository.api.types';
export * from './repositories/timelineRepository/timelineRepository.api.types';
export * from './repositories/emojiRepository/emojiRepository.api.types';
export * from './repositories/eventsRepository/eventsRepository.api.types';
export * from './repositories/assets2dRepository/assets2dRepository.api.types';
export * from './repositories/assets3dRepository/assets3dRepository.api.types';
export * from './repositories/objectInfoRepository/objectInfoRepository.api.types';
export * from './repositories/objectRepository/objectRepository.api.types';
export * from './repositories/agoraRepository/agoraRepository.api.types';
export * from './repositories/streamChatRepository/streamChatRepository.api.types';
export * from './repositories/objectUserAttributeRepository/objectUserAttributeRepository.api.types';
export * from './repositories/skyboxRepository/skyboxRepository.api.types';
export * from './repositories/aiImagesRepository/aiImagesRepository.api.types';
export * from './repositories/canvasRepository/canvasRepository.api.types';
