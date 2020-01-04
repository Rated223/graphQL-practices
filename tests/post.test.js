import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import bcrypt from "bcryptjs";
import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4001'
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  const firstUser = await prisma.mutation.createUser({
    data: {
      name: "testUser1",
      email: "testuser1@email.com",
      password: bcrypt.hashSync('demodemo')
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: "first Post",
      body: "",
      published: true,
      author: {
        connect: {
          id: firstUser.id
        }
      }
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: "Second Post",
      body: "",
      published: false,
      author: {
        connect: {
          id: firstUser.id
        }
      }
    }
  });
});

test('Should get all the published post', async () => {
  const getPosts = gql`
    query {
      getPosts {
        id
        title
        body
        published
      }
    }
  `;

  const response = await client.query({ query: getPosts });

  expect(response.data.getPosts.length).toBe(1);
  expect(response.data.getPosts[0].published).toBe(true);
})