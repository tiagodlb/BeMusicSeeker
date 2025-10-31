import { redis, RedisClient } from "bun";

class RedisService {
  private client: RedisClient | null = null;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      if (process.env.REDIS_URL) {
        this.client = new RedisClient(process.env.REDIS_URL, {
          autoReconnect: true,
          maxRetries: 3,
          enableOfflineQueue: true,
          enableAutoPipelining: true,
        });

        this.client.onconnect = () => {
          this.isConnected = true;
          console.log("Redis connected");
        };

        this.client.onclose = (error) => {
          this.isConnected = false;
          if (error) {
            console.error("Redis connection closed:", error);
          }
        };

        await this.client.connect();
      }
    } catch (error) {
      console.warn("Redis not available, using memory cache");
      this.client = null;
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      await this.client.set(key, value);
      if (ttl) {
        await this.client.expire(key, ttl);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      return await this.client.exists(key);
    } catch (error) {
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.client || !this.isConnected) return 0;
    try {
      return await this.client.incr(key);
    } catch (error) {
      return 0;
    }
  }

  getClient(): RedisClient | null {
    return this.isConnected ? this.client : null;
  }

  isHealthy(): boolean {
    return this.isConnected && this.client?.connected === true;
  }

  close(): void {
    if (this.client) {
      this.client.close();
      this.isConnected = false;
    }
  }
}

export const redisService = new RedisService();