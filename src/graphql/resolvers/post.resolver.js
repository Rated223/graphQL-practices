import { 
  getUserIdFromToken,
  verifyPostExist,
  verifyTitleTaken,
  verifyAuthorOfPost
} from './helpers';

const Query = {
  getPosts(parent, args, { prisma }, info) {
    const opArgs = { 
      where: { 
        published: true 
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy, 
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ]
    }

    return prisma.query.posts(opArgs, info);
  },
  async getMyPosts(parent, args, { prisma, request }, info) {
    const id = getUserIdFromToken({ request })
    const opArgs = { 
      where: { 
        author: { 
          id 
        }
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy, 
    }

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ]
    }

    return prisma.query.posts(opArgs, info);
  },
  async postById(parent, { id }, { prisma, request }, info) {
    await verifyPostExist({ id, prisma });
    const userId = getUserIdFromToken({ request, requiredAuth: false });
    const opArgs = { 
      where: { 
        id,
        OR: [
          {
            published: true
          },
          {
            author: { id: userId }
          }
        ]
      } 
    }
    const post = await prisma.query.posts(opArgs,info);
    console.log(post);

    if (post.length === 0) {
      throw new Error('Post not found');
    }

    return post[0];
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
  },
  myPost: {
    subscribe(parent, args, { prisma, request }, info) {
      const authorId = getUserIdFromToken({ request });
      return prisma.subscription.post({
        where: {
          node: {
            author: {
              id: authorId
            }
          }
        }
      }, info);
    }
  }
}

const Post = {
  comments: {
    fragment: 'fragment postPublished on Post { published, author { id } }',
    async resolve(parent, args, { prisma, request }, info) {
      const authorId = getUserIdFromToken({ request, requiredAuth: false });

      if (parent.published || parent.author.id === authorId) {
        return parent.comments
      }

      return null;
    }
  }
};

const postResolver = {Query, Mutation, Subscription, Post};

export default postResolver;