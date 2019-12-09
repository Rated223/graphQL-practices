import uuidv4 from 'uuid/v4';

const Query = {
  getUsers(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      }
    }

    return prisma.query.users(opArgs, info);
  },
  userById(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        id: args.id
      }
    }
    return prisma.query.user(opArgs, info)
  }
};

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error('This email already has an account.');
    }

    return await prisma.mutation.createUser({ data: args.data }, info);
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExist = await prisma.exists.User({ id: args.id });

    if (!userExist) {
      throw new Error('This user do not exist.');
    }

    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  async updateUser(parent, args, { prisma }, info) {
    const userExist = await prisma.exists.User({ id: args.id });

    if (!userExist) {
      throw new Error('This user do not exist.');
    }
    
    return await prisma.mutation.updateUser({
      data: args.data,
      where: {
        id: args.id
      }
    }, info);
  }
};

const User = {
 
};

const userResolver = {Query, Mutation, User};

export default userResolver;
