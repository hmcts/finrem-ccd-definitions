import lockfile from "proper-lockfile";
import fs from "fs-extra";
import path from "path";

const CACHE_PATH = path.resolve(__dirname, '../../token-cache.json');

export type CachedToken = {
  token: string;
  expiry: number;
  userId: string;
};

export async function readCache(): Promise<Map<string, CachedToken>> {
  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(CACHE_PATH, { retries: 5, realpath: false });
    const exists = await fs.pathExists(CACHE_PATH);
    if (!exists) return new Map();
    const data = await fs.readJson(CACHE_PATH);
    return new Map(Object.entries(data));
  } catch (err) {
    console.error('Error reading token cache:', err);
    return new Map();
  } finally {
    if (release) {
      await release().catch(err => {
        console.error('Error releasing lock after read:', err);
      });
    }
  }
}

export async function writeCache(cache: Map<string, CachedToken>): Promise<void> {
  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(CACHE_PATH, { retries: 5, realpath: false });
    const obj = Object.fromEntries(cache);
    await fs.writeJson(CACHE_PATH, obj, { spaces: 2 });
  } catch (err) {
    console.error('Error writing token cache:', err);
  } finally {
    if (release) {
      await release().catch(err => {
        console.error('Error releasing lock after write:', err);
      });
    }
  }
}

export async function deleteCacheFile(): Promise<void> {
  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(CACHE_PATH, { retries: 5, realpath: false });
    const exists = await fs.pathExists(CACHE_PATH);
    if (exists) {
      await fs.remove(CACHE_PATH);
    }
  } catch (err) {
    console.error('Error deleting token cache:', err);
  } finally {
    if (release) {
      await release().catch(err => {
        console.error('Error releasing lock after delete:', err);
      });
    }
  }
}
