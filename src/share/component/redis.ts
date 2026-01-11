import Redis, { Redis as RedisClient } from "ioredis";
import { ICacheService } from "../interface/cache";

/**
 * @description Redis adapter that implements the ICacheService port.
 * This class is part of the infrastructure layer.
 */

export class RedisCacheService implements ICacheService {
  private client: RedisClient;

  constructor() {
    // Connection details should come from a config service
    // For example: process.env.REDIS_URL
    this.client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    // Assuming data is stored as JSON string
    return JSON.parse(data) as T;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, stringValue, "EX", ttlSeconds);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const stream = this.client.scanStream({
      match: pattern,
      count: 100,
    });

    const keys = [];
    for await (const chunk of stream) {
      keys.push(...chunk);
    }

    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  public disconnect(): void {
    this.client.disconnect();
  }
}
