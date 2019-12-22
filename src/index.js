import '@babel/polyfill';
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

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log('server is up');
});