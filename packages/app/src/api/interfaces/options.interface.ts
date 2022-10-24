/**
 * Options returned by the backend that are stored in the common `options` field in different DB tables.
 * Similar to `metadata`, but a different field, typically to be modyfied.
 */
export interface OptionsInterface extends Record<string, unknown> {}
