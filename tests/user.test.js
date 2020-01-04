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

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
      createUser (
        data: {
          name: "Daniel",
          email: "daniel@test.com",
          password: "demodemo"
        }
      ) {
        token
        user {
          id
          name
          email
          password
          createdAt
          updatedAt
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser
  });

  const userExist = await prisma.exists.User({ id: response.data.createUser.user.id });

  expect(userExist).toBe(true);
});

test('Should expose public author profiles', async () => {
  const getUsers = gql`
    query {
      getUsers {
        id
        name
        email
      }
    }
  `;

  const response = await client.query({ query: getUsers });

  expect(response.data.getUsers.length).toBe(1);
  expect(response.data.getUsers[0].email).toBe(null);
  expect(response.data.getUsers[0].name).toBe('testUser1');
})