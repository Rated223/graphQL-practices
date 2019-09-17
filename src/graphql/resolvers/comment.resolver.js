import uuidv4 from 'uuid/v4';

const Query = {
  getComments(parent, args, ctx, info){
    return ctx.db.Comments;
  }
};

const Mutation = {
  createComment(parent, args, ctx, info) {
    const userExist = ctx.db.Users.some(user => user.id === args.data.author);
    if(!userExist) {
      throw new Error("The author do not exist");
    }

    const postExist = ctx.db.Posts.some(post => post.id === args.data.post && post.published);
    if(!postExist) {
      throw new Error("This post do not exist");
    }

    args.data.id = uuidv4();
    ctx.db.Comments.push(args.data);
    ctx.pubsub.publish(`comment ${args.data.post}`, { 
      comment: {
        mutation: 'CREATED',
        data: args.data
      }
    });
    return args.data;
  },
  deleteComment(parent, args, ctx, info) {
    const index = ctx.db.Comments.findIndex(comment => comment.id === args.id);
    if(index === -1){
      throw new Error('This comment do not exist');
    }
    const [comment] = ctx.db.Comments.splice(index, 1);

    ctx.pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    });

    return comment;
  },
  updateComment(parent, args, ctx, info) {
    const comment = ctx.db.Comments.find(comment => comment.id === args.id);

    if (!comment) {
      throw new Error('This comment do not exist');
    }

    if ( typeof args.text === 'string') {
      comment.text = args.text;
    }

    ctx.pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });

    return comment;
  }
};

const Subscription = {
  comment: {
    subscribe(parent,args, ctx, info) {
      const postExist = ctx.db.Posts.find(post => args.post === post.id && post.published);

      if (!postExist) {
        throw new Error('This post do not exist');
      }

      return ctx.pubsub.asyncIterator(`comment ${args.post}`);
    }
  }
}

const Comment = {
  author(parent, args, ctx, info) {
    return ctx.db.Users.find(user => user.id === parent.author);
  },
  post(parent, args, ctx, info) {
    return ctx.db.Posts.find(post => post.id === parent.post)
  }
};

const commentResolver = {Query, Mutation, Subscription, Comment};

export default commentResolver;