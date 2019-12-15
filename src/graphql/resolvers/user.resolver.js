import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  verifyEmailTaken,
  getUserIdFromToken,
  verifyUserExist,
  getUserFromLoginInput,
  verifyPasswordLength
} from './helpers'

const Query = {
  getUsers(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      }
    }

    return prisma.query.users(opArgs, info);
  },
  async userById(parent, { id }, { prisma }, info) {
    await verifyUserExist({ id, prisma });
    const opArgs = { where: { id } }
    return await prisma.query.user(opArgs, info)
  },
  async myInfo(parent, args, {prisma, request }, info) {
    const id = getUserIdFromToken({ request });
    const opArgs = { where: { id } }
    return await prisma.query.user(opArgs, info);
  }
};

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    await verifyEmailTaken({ email: data.email, prisma });
    verifyPasswordLength({ password: data.password });
    data.password = await bcrypt.hash(data.password, 10);
    const user = await prisma.mutation.createUser({ data });
    return { user, token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET) }
  },
  async login(parent, { data: {email, password} }, { prisma }, info) {
    const user = await getUserFromLoginInput({ email, password, prisma });
    return { user, token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET) }
  },
  async deleteUser(parent, {}, { prisma, request }, info) {
    const id = getUserIdFromToken({ request });
    return await prisma.mutation.deleteUser({ where: { id } }, info);
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    verifyPasswordLength({ password: data.password });
    const id = await getUserIdFromToken({ request })
    return await prisma.mutation.updateUser({  data, where: { id } }, info);
  }
};

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { request }, info) {
      const id = getUserIdFromToken({ request ,requiredAuth: false });

      if (id && id === parent.id) {
        return parent.email;
      }

      return null;
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    async resolve(parent, args, { prisma, request }, info) {
      const posts = await prisma.query.posts({ 
        where: { 
          published: true,
          author: { 
            id: parent.id 
          } 
        } 
      });
      return posts;
    }
  }
};

const userResolver = {Query, Mutation, User};

export default userResolver;