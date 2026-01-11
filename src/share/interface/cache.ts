/**
 * @description Port for caching operations.
 * This interface is technology-agnostic and resides in the application core.
 */
export interface ICacheService {
  /**
   * Retrieves a value from the cache by its key.
   * @param key The key of the item to retrieve.
   * @returns The cached value, or null if not found.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores a value in the cache.
   * @param key The key to store the value under.
   * @param value The value to store (will be serialized).
   * @param ttlSeconds Time-to-live in seconds (optional).
   */
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;

  /**
   * Deletes a value from the cache by its key.
   * @param key The key of the item to delete.
   */
  delete(key: string): Promise<void>;

  /**
   * Deletes all keys matching a pattern.
   * @param pattern The pattern to match (e.g., 'user:*').
   */
  deleteByPattern(pattern: string): Promise<void>;
}
