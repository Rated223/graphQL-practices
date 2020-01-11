import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: "testUser1",
    email: "testuser1@email.com",
    password: bcrypt.hashSync('demodemo')
  },
  output: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: "testUser2",
    email: "testuser2@email.com",
    password: bcrypt.hashSync('demodemo')
  },
  output: undefined,
  jwt: undefined
}

const postOne = {
  input: {
    title: "first Post",
    body: "",
    published: true
  },
  output: undefined
}

const commentOne = {
  input: {
    text: "good post!"
  },
  output: undefined,
}

const commentTwo = {
  input: {
    text: "thanks!",
  },
  output: undefined,
}

const  seeder = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  userOne.output = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.output.id, }, process.env.JWT_SECRET);

  userTwo.output = await prisma.mutation.createUser({
    data: userTwo.input
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.output.id }, process.env.JWT_SECRET);

  postOne.output = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id:  userOne.output.id
        }
      }
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Second Post",
      body: "",
      published: false,
      author: {
        connect: {
          id:  userOne.output.id
        }
      }
    }
  });

  commentOne.output = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userTwo.output.id
        }
      },
      post: {
        connect: {
          id: postOne.output.id
        }
      }
    }
  });

  commentTwo.output = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userOne.output.id
        }
      },
      post: {
        connect: {
          id: postOne.output.id
        }
      }
    }
  });
}

export { 
  seeder as default,
  userOne,
  userTwo,
  postOne,
  commentOne,
  commentTwo
}