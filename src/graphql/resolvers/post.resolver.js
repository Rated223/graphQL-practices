import uuidv4 from 'uuid/v4';

const Query = {
  getPosts(parent, args, ctx, info) {
    if (!args.query) {
      return ctx.db.Posts;
    }
    return ctx.db.Posts.filter(({title}) => {
      return title.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  postById(parent, args, ctx, info) {
    return {
      id: "234",
      title: "post title",
      body: "blablablablabla",
      published: true
    }
  }
};

const Mutation = {
  createPost(parent, args, ctx, info) {
    const titleTaken = ctx.db.Posts.some(post => post.title === args.data.title);
    if (titleTaken){
      throw new Error("This title belongs to another post");
    }

    const userExist = ctx.db.Users.some(user => user.id === args.data.author);
    if (!userExist) {
      throw new Error("The author do not exist");
    }

    if (!args.data.published){
      args.data.published = false;
    }

    args.data.id = uuidv4();
    ctx.db.Posts.push(args.data);
    if (args.data.published) {
      ctx.pubsub.publish(`post`, { 
        post: {
          mutation: 'CREATED', 
          data: args.data 
        } 
      });
    }
    return args.data;
  },
  deletePost(parent, args, ctx, info) {
    const index = ctx.db.Posts.findIndex(post => post.id === args.id);
    if(index === -1){
      throw new Error('This post do not exist');
    }
    const [post] = ctx.db.Posts.splice(index, 1);

    ctx.db.Comments = ctx.db.Comments.filter(comment => comment.post !== args.id);

    if (post.published) {
      ctx.pubsub.publish(`post`, {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post;
  },
  updatePost(parent, args, ctx, info) {
    const post = ctx.db.Posts.find(post => post.id === args.id);
    const originalPost = { ...Post };

    if(!post) {
      throw new Error('This post do not exist');
    }

    if (typeof args.data.author !== 'undefined') {
      const author = ctx.db.Users.find(user => user.id === args.data.author);
      if (!author) {
        throw new Error('The author selected do not exist');
      } else {
        post.author = args.data.author;
      }
    }
    
    if (typeof args.data.title === 'string') {
      post.title = args.data.title;
    }

    if (typeof args.data.body === 'string') {
      post.body = args.data.body;
    }

    if (typeof args.data.published === 'boolean') {
      post.published = args.data.published;

      if (originalPost.published && !post.published) {
        ctx.pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        ctx.pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      ctx.pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;
  }
};

const Subscription = {
  post: {
    subscribe(parent, args, ctx, info) {
      return ctx.pubsub.asyncIterator(`post`);
    }
  }
}

const Post = {
  author(parent, args, ctx, info) {
    return ctx.db.Users.find(user => user.id === parent.author);
  },
  comments(parent, args, ctx, info) { 
    return ctx.db.Comments.filter(comment => comment.post === parent.id)
  }
};

const postResolver = {Query, Mutation, Subscription, Post};

export default postResolver;