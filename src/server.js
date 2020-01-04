import { GraphQLServer, PubSub } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import prisma from './prisma';

const typeDefs = importSchema('src/graphql/schema.graphql');
import { resolvers, fragmentReplacements } from './graphql/resolver';
import db from './db/db';


const pubsub = new PubSub();

const server = new GraphQLServer({ 
  typeDefs, 
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    }
  },
  fragmentReplacements
});

export { server as default }