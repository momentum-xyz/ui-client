import * as configRepository from './repositories/configRepository';
import * as webRepository from './repositories/webRepository';
import * as guestRepository from './repositories/guestRepository';
import * as userRepository from './repositories/userRepository';
import * as profileRepository from './repositories/profileRepository';
import * as eventsRepository from './repositories/eventsRepository';
import * as spaceRepository from './repositories/spaceRepository';
import * as stageModeRepository from './repositories/stageModeRepository';
import * as magicRepository from './repositories/magicRepository';
import * as tokenRuleRepository from './repositories/tokenRuleRepository';
import * as validatorsRepository from './repositories/validatorsRepository';
import * as tokenRepository from './repositories/tokenRepository';
import * as favoriteRepository from './repositories/favoriteRepository';
import * as spaceTypeRepository from './repositories/spaceTypeRepository';
import * as tablesRepository from './repositories/tablesRepository';
import * as spaceInviteRepository from './repositories/spaceInviteRepository';
import * as statsRepository from './repositories/statsRepository';
import * as statusRepository from './repositories/statusRepository';

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
  configRepository,
  webRepository,
  guestRepository,
  userRepository,
  profileRepository,
  eventsRepository,
  spaceRepository,
  stageModeRepository,
  magicRepository,
  tokenRuleRepository,
  tokenRepository,
  favoriteRepository,
  validatorsRepository,
  spaceTypeRepository,
  tablesRepository,
  spaceInviteRepository,
  statsRepository,
  statusRepository
};

/**
 * Re-exports of related types
 *
 * Types can include Request and Response namespaces
 * This is a contract between API and frontend
 */
export * from './repositories/configRepository/configRepository.api.types';
export * from './repositories/webRepository/webRepository.api.types';
export * from './repositories/guestRepository/guestRepository.api.types';
export * from './repositories/spaceRepository/spaceRepository.api.types';
export * from './repositories/userRepository/userRepository.api.types';
export * from './repositories/profileRepository/profileRepository.api.types';
export * from './repositories/eventsRepository/eventsRepository.api.types';
export * from './repositories/validatorsRepository/validatorsRepository.api.types';
export * from './repositories/tokenRuleRepository/tokenRuleRepository.api.types';
export * from './repositories/magicRepository/magicRepository.api.types';
export * from './repositories/favoriteRepository/favoriteRepository.api.types';
export * from './repositories/tokenRepository/tokenRepository.api.types';
export * from './repositories/statsRepository/statsRepository.api.types';
