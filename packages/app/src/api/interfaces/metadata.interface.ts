/**
 * Metadata returned by the backend that are stored in the common `metadata` field in different DB tables.
 * Similar to `options`, but a different field, typically retrieved from the blockchain and not to be modified.
 */
export interface MetadataInterface extends Record<string, unknown> {}
