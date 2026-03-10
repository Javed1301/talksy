# Setup & Bug Fix Revision

This document outlines the issues encountered during the initial setup of the **Talksy** application and exactly how they were resolved.

## 1. Client App: Missing `@tailwindcss/vite` Package
**Problem:** 
Running `npm run dev` in `apps/client` failed with:
`Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@tailwindcss/vite'`

**Root Cause:**
The root `package.json` lacked a `workspaces` array configuration (e.g., `"workspaces": ["apps/*"]`). Because of this, running `npm install` in the root directory only installed the root dependencies and did not install the dependencies specified in `apps/client/package.json`.

**Solution:**
We navigated directly into the `apps/client` directory and ran `npm install` specifically for the client app to resolve all missing frontend dependencies (like Vite and Tailwind CSS).
```bash
cd apps/client
npm install
npm run dev
```

---

## 2. Server App: Missing Prisma Client Module
**Problem:** 
Running `npm run server` in the root (which executes `tsx watch apps/server/src/index.ts`) crashed with:
`Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../apps/server/src/generated/client/index.js'`

**Root Cause:** 
The Prisma client had not been generated yet, so the generated files that the server was trying to import did not exist.

We encountered a chain of configuration errors while trying to generate the Prisma client (`npx prisma generate`):

1. **Missing Environment Variables:** `npx prisma generate` failed because `DATABASE_URL` was not defined in the environment.
   - **Fix:** We created a `.env` file in `apps/server` (and in the root project folder) and added a standard local connection string: `DATABASE_URL=postgresql://postgres:secret@localhost:5432/whatsapp_db?schema=public`.

2. **Missing `url` property in `schema.prisma`:** Schema validation failed because the `datasource db` block in `apps/server/prisma/schema.prisma` was completely missing the `url` property.
   - **Fix:** We updated the schema file to include the URL from the environment variable:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```

3. **Invalid `@prisma/client` Version:** Even after fixing the environment and schema, generation failed to copy the engine files. This happened because the root `package.json` contained an invalid, non-existent version of `@prisma/client` (`^7.3.0`). However, the `prisma` CLI was version `^6.19.2`, creating a version mismatch that corrupted `node_modules`.
   - **Fix:** We updated the `@prisma/client` version to `^6.19.2` inside the root `package.json` so that both Prisma packages align, and then we re-ran `npm install` in the root folder.

**Solution:**
After correcting the environment variables, the database URL block, and the matching dependency version, we successfully generated the Prisma client:
```bash
cd apps/server
npx prisma generate
```

This successfully generated the client into `src/generated/client`, which resolved the module not found error and allowed the backend server to boot normally.
