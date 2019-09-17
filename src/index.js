import { GraphQLServer, PubSub } from 'graphql-yoga';
import { importSchema } from 'graphql-import';

const typeDefs = importSchema('src/graphql/schema.graphql');
import resolvers from './graphql/resolver';
import db from './db/db';

const pubsub = new PubSub();

const server = new GraphQLServer({ 
  typeDefs, 
  resolvers,
  context: {
    db,
    pubsub
  }
});

server.start(() => {
  console.log('server is up');
});