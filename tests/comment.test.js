import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seeder, { userOne, commentOne, commentTwo } from './utils/seeder';
import getClient from './utils/getClient';
import {
  deleteComment
} from './utils/operations';

const client = getClient({});

beforeEach(async () => {
  await seeder();
});

test('Should delete own comment', async () => {
  const client = getClient({ jwt: userOne.jwt });

  const variables = {
    id: commentTwo.output.id
  }

  await client.mutate({ mutation: deleteComment, variables });
  const commentExist = await prisma.exists.Comment({ id: commentTwo.output.id });

  expect(commentExist).toBe(false);
});

test('Should not delete other users comment', async () => {
  const client = getClient({ jwt: userOne.jwt });

  const variables = {
    id: commentOne.output.id
  }

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();
})