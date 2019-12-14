import { 
  getUserIdFromToken,
  verifyPostExist,
  verifyTitleTaken,
  verifyAuthorOfPost
} from './helpers';

const Query = {
  getPosts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            body_contains: args.query
          }
        ]
      }
    }

    return prisma.query.posts(opArgs, info);
  },
  async postById(parent, { id }, { prisma }, info) {
    await verifyPostExist({ id });
    const opArgs = { where: { id } }
    return prisma.query.user(opArgs,info);
  }
};

const Mutation = {
  async createPost(parent, { data }, { prisma, request }, info) {
    await verifyTitleTaken({ title: data.title, prisma });
    const id = getUserIdFromToken({ request });
    data.author = { connect: { id } } 
    return await prisma.mutation.createPost({ data }, info)
  },
  async deletePost(parent, { id }, { prisma, request }, info) {
    await verifyPostExist({ id, prisma });
    const authorId = getUserIdFromToken({ request });
    await verifyAuthorOfPost({ id, authorId, prisma });
    return await prisma.mutation.deletePost({ where: { id } }, info);
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    await verifyPostExist({ id, prisma });
    const authorId = getUserIdFromToken({ request });
    await verifyAuthorOfPost({ id, authorId, prisma });
    return await prisma.mutation.updatePost({ data, where: { id } }, info);
  }
};

const Subscription = {
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      }, info);
    }
  }
}

const Post = {
  
};

const postResolver = {Query, Mutation, Subscription, Post};

export default postResolver;