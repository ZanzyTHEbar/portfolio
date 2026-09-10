# PocketBase runs as an external service (D1, D5). No PocketBase client or
# token ever ships in the browser bundle — collections are synced at
# build/sync time via scripts/pocketbase-sync.ts into a static snapshot.
FROM ghcr.io/muchobien/pocketbase:latest
RUN mkdir -p /pb_migrations /pb_data
EXPOSE 8090
