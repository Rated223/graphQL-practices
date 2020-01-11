import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seeder, { userOne, postOne } from './utils/seeder';
import getClient from './utils/getClient';
import {
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost
} from './utils/operations';

const client = getClient({});

beforeEach(async () => {
  await seeder();
});

test('Should get all the published post', async () => {
  const response = await client.query({ query: getPosts });

  expect(response.data.getPosts.length).toBe(1);
  expect(response.data.getPosts[0].published).toBe(true);
});

test('Should get the post of the account', async () => {
  const client = getClient({  jwt: userOne.jwt });
  const response = await client.query({ query: myPosts });

  expect(response.data.getMyPosts.length).toBe(2);
  expect(response.data.getMyPosts[0].title).toBe('first Post');
  expect(response.data.getMyPosts[0].published).toBe(true);
  expect(response.data.getMyPosts[1].title).toBe('Second Post');
  expect(response.data.getMyPosts[1].published).toBe(false);
}, 150000);

test('Should be able to update one post', async () => {
  const client = getClient({ jwt: userOne.jwt });

  const variables = {
    id: postOne.output.id,
    data: {
      published: false
    }
  }

  const response = await client.mutate({ mutation: updatePost, variables });
  const postExists = await prisma.exists.Post({ id: postOne.output.id, published: false });

  expect(response.data.updatePost.published).toBe(false);
  expect(postExists).toBe(true);
});

test('Should create a Post', async () => {
  const client = getClient({ jwt: userOne.jwt });

  const variables = {
    data: {
      title: "New post for test",
      body: "body of test post",
      published: true
    }
  }
  
  const response = await client.mutate({ mutation: createPost, variables });
  const postExists = await prisma.exists.Post({ id: response.data.createPost.id });

  expect(postExists).toBe(true);
  expect(response.data.createPost.title).toBe('New post for test');
  expect(response.data.createPost.body).toBe('body of test post');
  expect(response.data.createPost.published).toBe(true);
});

test('Should delete a post', async () => {
  const client = getClient({ jwt: userOne.jwt });

  const variables = {
    id: postOne.output.id
  }

  await client.mutate({ mutation: deletePost, variables });
  const postExists = await prisma.exists.Post({ id: postOne.output.id });

  expect(postExists).toBe(false);
})