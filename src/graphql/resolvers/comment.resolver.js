import {
  getUserIdFromToken,
  verifyPostExist,
  verifyCommentExist,
  verifyAuthorOfComment
} from './helpers';

const Query = {
  getComments(parent, args, { prisma }, info){
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }


    return prisma.query.comments(opArgs, info);
  }
};

const Mutation = {
  async createComment(parent, { data }, { prisma, request }, info) {
    const userId = await getUserIdFromToken({ request });
    await verifyPostExist({ id: data.post, prisma, checkPublished: true });
    data.author = { connect: { id: userId } };
    data.post = { connect: { id: data.post } }
    return await prisma.mutation.createComment({ data }, info)
  },
  async deleteComment(parent, { id }, { prisma, request }, info) {
    await verifyCommentExist({ id, prisma });
    const authorId = await getUserIdFromToken({ request });
    await verifyAuthorOfComment({ id, authorId, prisma });
    return await prisma.mutation.deleteComment({where: { id } }, info);
  },
  async updateComment(parent, { id, text }, { prisma, request }, info) {
    await verifyCommentExist({ id, prisma });
    const authorId = await getUserIdFromToken({ request });
    await verifyAuthorOfComment({ id, authorId, prisma });
    return await prisma.mutation.updateComment({ data: { text }, where: { id } }, info);
  }
};

const Subscription = {
  comment: {
    subscribe(parent,args, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: args.post
            }
          }
        }
      }, info); 
    }
  }
}

const Comment = {

};

const commentResolver = {Query, Mutation, Subscription, Comment};

export default commentResolver;