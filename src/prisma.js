import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './graphql/resolver';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
  secret: process.env.PRISMA_SECRET || 'secret_pass',
  fragmentReplacements
});

export { prisma as default }