import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client/index.js';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

// 1. Get the current directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Point to the .env file inside apps/server
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


// dotenv.config();

// 1. Validate Database URL (Solves the TypeScript 'undefined' error)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing in .env file. Check your config!");
}

// 2. Initialize the PostgreSQL Connection Pool
const pool = new Pool({ connectionString });

// 3. Setup the Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);

// 4. Create the Prisma Client instance (Singleton)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

console.log("✅ Prisma Client initialized with PostgreSQL Adapter");