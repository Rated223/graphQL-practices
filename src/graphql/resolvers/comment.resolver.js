import uuidv4 from 'uuid/v4';

const Query = {
  getComments(parent, args, { prisma }, info){
    return prisma.query.comments(null, info);
  }
};

const Mutation = {
  async createComment(parent, args, { prisma }, info) {
    const userExist = await prisma.exists.User({ id: args.data.author });
    if(!userExist) {
      throw new Error("The author do not exist");
    }

    const authorId = args.data.author;
    args.data.author = {
      connect: {
        id: authorId
      }
    }

    const postExist = await prisma.exists.Post({ id: args.data.post, published: true });
    if(!postExist) {
      throw new Error("This post do not exist");
    }

    const postId = args.data.post;
    args.data.post = {
      connect: {
        id: postId
      }
    }

    return await prisma.mutation.createComment({ data: args.data }, info)
  },
  async deleteComment(parent, args, { prisma }, info) {
    const commentExist = await prisma.exists.Comment({ id: args.id })

    if(!commentExist){
      throw new Error('This comment do not exist');
    }
    
    return await prisma.mutation.deleteComment({where: { id: args.id } }, info);
  },
  async updateComment(parent, args, { prisma }, info) {
    const commentExist = await prisma.exists.Comment({ id: args.id })

    if(!commentExist){
      throw new Error('This comment do not exist');
    }

    return await prisma.mutation.updateComment({
      data: {
        text: args.text
      },
      where: {
        id: args.id
      }
    }, info);
  }
};

const Subscription = {
  comment: {
    subscribe(parent,args, { prisma }, info) {
      const postExist = db.Posts.find(post => args.post === post.id && post.published);

      if (!postExist) {
        throw new Error('This post do not exist');
      }

      return pubsub.asyncIterator(`comment ${args.post}`);
    }
  }
}

const Comment = {

};

const commentResolver = {Query, Mutation, Subscription, Comment};

export default commentResolver;