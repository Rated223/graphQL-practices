import uuidv4 from 'uuid/v4';

const Query = {
  getPosts(parent, args, { db, prisma }, info) {
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
  postById(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        id: args.id
      }
    }
    
    return prisma.query.user(opArgs,info);
  }
};

const Mutation = {
  async createPost(parent, args, { prisma }, info) {
    const titleTaken = await prisma.exists.Post({ title: args.data.title })

    if (titleTaken){
      throw new Error("This title belongs to another post");
    }

    const userExist = await prisma.exists.User({ id: args.data.author })

    if (!userExist) {
      throw new Error("The author do not exist");
    }

    const autorId = args.data.author;
    args.data.author = {
      connect: {
        id: autorId
      }
    } 

    return await prisma.mutation.createPost({ data: args.data }, info)
  },
  async deletePost(parent, args, { prisma }, info) {
    const postExist = await prisma.exists.Post({ id: args.id })

    if(!postExist){
      throw new Error('This post do not exist');
    }
    
    return await prisma.mutation.deletePost({where: { id: args.id } }, info);
  },
  async updatePost(parent, args, { prisma }, info) {
    const postExist = await prisma.exists.Post({ id:args.id });
    if(!postExist) {
      throw new Error('This post do not exist');
    }
    
    if (typeof args.data.author !== 'undefined') {
      const autorExist = await prisma.exists.User({ id: args.data.author });
      if (!autorExist) {
        throw new Error('The author selected do not exist');
      } else {
        const authorId = args.data.author;
        args.data.author = {
          connect: {
            id: authorId
          }
        };
      }
    }
    
    return await prisma.mutation.updatePost({
      data: args.data,
      where: {
        id: args.id
      }
    }, info);
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