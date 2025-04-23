-- Convert datetime strings to timestamp_ms for all tables
-- Using built-in SQLite functions instead of custom functions

UPDATE chats 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE complexity_assessment_criteria 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE function_points 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE functionality_time 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE module_time 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE project_functionalities 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE project_modules 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE project_timelines 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE projects 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END,
    deleted_at = CASE 
      WHEN deleted_at IS NULL THEN NULL 
      ELSE CAST((julianday(deleted_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%' OR deleted_at LIKE '%-%';
--> statement-breakpoint

UPDATE test_cases 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE timeline_items 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE timeline_items_to_project_modules 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%';
--> statement-breakpoint

UPDATE users 
SET created_at = CAST((julianday(created_at) - 2440587.5) * 86400000 AS INTEGER),
    updated_at = CASE 
      WHEN updated_at IS NULL THEN NULL 
      ELSE CAST((julianday(updated_at) - 2440587.5) * 86400000 AS INTEGER)
    END,
    email_verified_at = CASE 
      WHEN email_verified_at IS NULL THEN NULL 
      ELSE CAST((julianday(email_verified_at) - 2440587.5) * 86400000 AS INTEGER)
    END
WHERE created_at LIKE '%-%' OR updated_at LIKE '%-%' OR email_verified_at LIKE '%-%';