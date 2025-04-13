-- First, drop any foreign key constraints referencing user_id
PRAGMA foreign_keys=OFF;--> statement-breakpoint

CREATE TABLE new_verifications (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    updated_at INTEGER DEFAULT (unixepoch() * 1000),
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at INTEGER NOT NULL
);--> statement-breakpoint

INSERT INTO new_verifications (id, created_at, updated_at, identifier, value, expires_at)
SELECT id, created_at, updated_at, identifier, value, expires_at
FROM verifications;--> statement-breakpoint

DROP TABLE verifications;--> statement-breakpoint

ALTER TABLE new_verifications RENAME TO verifications;--> statement-breakpoint

PRAGMA foreign_keys=ON;