import uuidv4 from 'uuid/v4';

const Query = {
  getPosts(parent, args, { db, prisma }, info) {
    return prisma.query.posts(null, info);
    // if (!args.query) {
    //   return db.Posts;
    // }
    // return db.Posts.filter(({title}) => {
    //   return title.toLowerCase().includes(args.query.toLowerCase());
    // });
  },
  postById(parent, args, { db, prisma }, info) {
    return {
      id: "234",
      title: "post title",
      body: "blablablablabla",
      published: true
    }
  }
};

const Mutation = {
  createPost(parent, args, { db, prisma }, info) {
    const titleTaken = db.Posts.some(post => post.title === args.data.title);
    if (titleTaken){
      throw new Error("This title belongs to another post");
    }

    const userExist = db.Users.some(user => user.id === args.data.author);
    if (!userExist) {
      throw new Error("The author do not exist");
    }

    if (!args.data.published){
      args.data.published = false;
    }

    args.data.id = uuidv4();
    db.Posts.push(args.data);
    if (args.data.published) {
      pubsub.publish(`post`, { 
        post: {
          mutation: 'CREATED', 
          data: args.data 
        } 
      });
    }
    return args.data;
  },
  deletePost(parent, args, { db, prisma }, info) {
    const index = db.Posts.findIndex(post => post.id === args.id);
    if(index === -1){
      throw new Error('This post do not exist');
    }
    const [post] = db.Posts.splice(index, 1);

    db.Comments = db.Comments.filter(comment => comment.post !== args.id);

    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return post;
  },
  updatePost(parent, args, { db, prisma }, info) {
    const post = db.Posts.find(post => post.id === args.id);
    const originalPost = { ...Post };

    if(!post) {
      throw new Error('This post do not exist');
    }

    if (typeof args.data.author !== 'undefined') {
      const author = db.Users.find(user => user.id === args.data.author);
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
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      pubsub.publish('post', {
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
    subscribe(parent, args, { db, prisma }, info) {
      return pubsub.asyncIterator(`post`);
    }
  }
}

const Post = {
  author(parent, args, { db, prisma }, info) {
    return db.Users.find(user => user.id === parent.author);
  },
  comments(parent, args, { db, prisma }, info) { 
    return db.Comments.filter(comment => comment.post === parent.id)
  }
};

const postResolver = {Query, Mutation, Subscription, Post};

export default postResolver;