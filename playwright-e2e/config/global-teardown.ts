import {deleteCacheFile} from "../data-utils/api/TokenCachingHelper.ts";

export default async function globalTeardown() {
    await deleteCacheFile();
}
