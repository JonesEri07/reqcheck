-- Drop all tables in the public schema
-- WARNING: This will delete all data!

-- Drop all tables (CASCADE will also drop dependent objects)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Drop the drizzle migrations table if it exists
DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE;

-- Optionally drop the drizzle schema (if you want a completely fresh start)
-- DROP SCHEMA IF EXISTS drizzle CASCADE;
