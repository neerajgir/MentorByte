// prisma.config.ts
import 'dotenv/config'; // Loads variables for Node compatibility
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Accessing process.env directly bypasses Prisma's parsing bugs
    url: process.env.DATABASE_URL!, 
  },
});
