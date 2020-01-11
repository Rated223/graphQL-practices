import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seeder, { userOne } from './utils/seeder';
import getClient from './utils/getClient';
import {
  createUser,
  getUsers,
  login,
  getProfile
} from './utils/operations';

const client = getClient({});

beforeEach(async () => {
  await seeder();
});

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'Daniel',
      email: 'test@email.com',
      password: 'demodemo'
    }
  }

  const response = await client.mutate({ mutation: createUser, variables });
  const userExist = await prisma.exists.User({ id: response.data.createUser.user.id });

  expect(userExist).toBe(true);
});

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.getUsers.length).toBe(2);
  expect(response.data.getUsers[0].email).toBe(null);
  expect(response.data.getUsers[0].name).toBe('testUser1');
});

test('Should fail authentication with bad credentials', async () => {
  const variables = {
    data: {
      email: "testuser1@email.com",
      password: "fakePass"
    }
  }

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test('Should fetch user profile', async () => {
  const client = getClient({ jwt: userOne.jwt });
   const { data } = await client.query({ query: getProfile });

  expect(data.myInfo.id).toBe(userOne.output.id);
  expect(data.myInfo.name).toBe(userOne.output.name);
  expect(data.myInfo.email).toBe(userOne.output.email);
});