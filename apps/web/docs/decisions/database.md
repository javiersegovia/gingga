# Database Choice: Turso vs D1

## Decision

We chose Turso as our SQLite database provider instead of Cloudflare D1.

## Key Factors

### Primary Reason: Database Branching

Turso provides built-in database branching capabilities, which are essential for our development workflow:

- Create isolated development environments instantly. This allow us to create a new database branch for each pull request.
- Test schema changes safely.
- Run experiments without affecting production data.
- Quick rollback capabilities through branch management.

### Why SQLite-based Solution

As an edge-first application, SQLite offers significant advantages:

- Serverless architecture (embedded database)
- Excellent portability (single file database)
- Ultra-lightweight setup and administration
- Fast read operations for edge environments
- Minimal resource requirements

### Additional Benefits

1. **Better Development Experience**

   - Embedded sync for local development
   - Flexible import/export options (sqlite files or dumps)
   - Location control for database placement

2. **Tooling & Integration**
   - Native support for database branching
   - Better export/import workflows
   - More extensive extension support
   - Built-in sync capabilities for local development

## Comparison with D1

While D1 offers tight integration with Cloudflare Workers, it currently lacks:

- Database branching capabilities
- Reliable export/import workflows
- Local development sync features

## Future Considerations

We may consider migrating to Cloudflare D1 in the future when:

- D1 implements database branching capabilities
- Our infrastructure becomes more Cloudflare-centric
- D1's development tooling matures
- Local development experience improves
