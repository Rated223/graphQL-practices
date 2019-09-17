import uuidv4 from 'uuid/v4';

const Query = {
  getUsers(parent, args, ctx, info) {
    if(!args.query)
      return ctx.db.Users

    return ctx.db.Users.filter(({name}) => name.toLowerCase().includes(args.query.toLowerCase()));
  },
  userById() {
    return {
      id: "23456",
      name: "Daniel",
      email: "test@email.com"
    }
  }
};

const Mutation = {
  createUser(parent, args, ctx, info) {
    const emailTaken = ctx.db.Users.some(user => user.email === args.data.email);
    if (emailTaken) {
      throw new Error("Email already taken");
    }
    
    args.data.id = uuidv4();
    ctx.db.Users.push(args.data);
    return args.data;
  },
  deleteUser(parent, args, ctx, info) {
    const index = ctx.db.Users.findIndex(user => user.id === args.id);
    if (index === -1) {
      throw new Error("This user do not exist");
    }
    const user = ctx.db.Users.splice(index, 1);
    Posts = Posts.filter(post => {
      const match = post.author === args.id;
      if (match) {
        Comments = Comments.filter(comment => comment.post !== post.id)
      }
      return !match;
    })
    Comments = Comments.filter(comment => comment.author !== args.id)
    return user[0];
  },
  updateUser(parent, args, ctx, info) {
    const user = ctx.db.Users.find(user => user.id === args.id);
    if(!user) {
      throw new Error('This user do not exist');
    }
    if (typeof args.data.email === 'string') {
      const emailTaken = ctx.db.Users.some(user => user.email === args.data.email);
      if(emailTaken) {
        throw new Error('This email already exist in another account');
      }
      user.email = args.data.email;
    }
    if (typeof args.data.name === 'string') {
      user.name = args.data.name;
    }
    if (typeof args.data.age !== 'undefined') {
      try {
        user.age = args.data.age;
      } catch(e) {
        throw new Error('The age must be a valid number');
      }
    }
    return user;
  }
};

const User = {
  posts(parent, args, ctx, info) {
    return ctx.db.Posts.filter(post => post.author === parent.id);
  },
  comments(parent, args, ctx, info) {
    return ctx.db.Comments.filter(comment => comment.author === parent.id);
  }
};

const userResolver = {Query, Mutation, User};

export default userResolver;
