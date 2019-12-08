import uuidv4 from 'uuid/v4';

const Query = {
  getComments(parent, args, { db, prisma }, info){
    return db.Comments;
  }
};

const Mutation = {
  createComment(parent, args, { db, prisma }, info) {
    const userExist = db.Users.some(user => user.id === args.data.author);
    if(!userExist) {
      throw new Error("The author do not exist");
    }

    const postExist = db.Posts.some(post => post.id === args.data.post && post.published);
    if(!postExist) {
      throw new Error("This post do not exist");
    }

    args.data.id = uuidv4();
    db.Comments.push(args.data);
    pubsub.publish(`comment ${args.data.post}`, { 
      comment: {
        mutation: 'CREATED',
        data: args.data
      }
    });
    return args.data;
  },
  deleteComment(parent, args, { db, prisma }, info) {
    const index = db.Comments.findIndex(comment => comment.id === args.id);
    if(index === -1){
      throw new Error('This comment do not exist');
    }
    const [comment] = db.Comments.splice(index, 1);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    });

    return comment;
  },
  updateComment(parent, args, { db, prisma }, info) {
    const comment = db.Comments.find(comment => comment.id === args.id);

    if (!comment) {
      throw new Error('This comment do not exist');
    }

    if ( typeof args.text === 'string') {
      comment.text = args.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
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
    subscribe(parent,args, { db, prisma }, info) {
      const postExist = db.Posts.find(post => args.post === post.id && post.published);

      if (!postExist) {
        throw new Error('This post do not exist');
      }

      return pubsub.asyncIterator(`comment ${args.post}`);
    }
  }
}

const Comment = {
  author(parent, args, { db, prisma }, info) {
    return db.Users.find(user => user.id === parent.author);
  },
  post(parent, args, { db, prisma }, info) {
    return db.Posts.find(post => post.id === parent.post)
  }
};

const commentResolver = {Query, Mutation, Subscription, Comment};

export default commentResolver;