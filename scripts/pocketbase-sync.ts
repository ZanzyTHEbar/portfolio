// Build/sync-time PocketBase evidence sync (D5, A14). NEVER import from the
// browser bundle: reads PB_URL/PB_SYNC_TOKEN from env, writes a static JSON
// snapshot for routes to embed. Collections: evidence, activity,
// github_snapshots. Transport/store are injectable for tests and offline runs.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const COLLECTIONS = [
  "evidence",
  "activity",
  "github_snapshots",
] as const;
export type CollectionName = (typeof COLLECTIONS)[number];
export type Snapshot = Record<CollectionName, unknown[]>;

export interface Transport {
  list(collection: CollectionName): Promise<unknown[]>;
}

export interface Store {
  write(snapshot: Snapshot): Promise<void>;
}

// Offline default: empty snapshot (no server in v1). Swap for a real
// PocketBase client transport in scripts that run with PB_SYNC_TOKEN set.
export const emptyTransport: Transport = {
  list: (_collection) => Promise.resolve([]),
};

export function fileStore(path: string): Store {
  return {
    write: (snapshot) => {
      writeFileSync(path, JSON.stringify(snapshot, null, 2));
      return Promise.resolve();
    },
  };
}

export async function sync(
  transport: Transport = emptyTransport,
  store: Store = fileStore(
    join(new URL("../pocketbase/", import.meta.url).pathname, "snapshot.json"),
  ),
): Promise<Snapshot> {
  const snapshot = Object.fromEntries(
    await Promise.all(
      COLLECTIONS.map(async (c) => [c, await transport.list(c)] as const),
    ),
  ) as Snapshot;
  await store.write(snapshot);
  return snapshot;
}

const counts = (s: Snapshot) =>
  Object.entries(s)
    .map(([k, v]) => `${k}=${v.length}`)
    .join(" ");

// ponytail: entrypoint-only side effect; importing this module stays pure.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  sync().then(
    (s) => console.log(`pocketbase-sync: ok (${counts(s)})`),
    (err) => {
      console.error("pocketbase-sync: failed", err);
      process.exit(1);
    },
  );
}
