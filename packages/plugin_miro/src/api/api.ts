import * as integrationRepository from './repositories/integrationRepository';

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
  integrationRepository
};

/**
 * Re-exports of related types
 *
 * Types can include Request and Response namespaces
 * This is a contract between API and frontend
 */
export * from './repositories/integrationRepository/integrationRepository.api.types';
