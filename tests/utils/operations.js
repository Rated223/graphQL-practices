import { gql } from 'apollo-boost';

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser (
      data: $data
    ) {
      token
      user {
        id
        name
        email
        password
        createdAt
        updatedAt
      }
    }
  }
`;

const getUsers = gql`
query {
  getUsers {
    id
    name
    email
  }
}
`;

const login = gql`
  mutation ($data: LoginUserInput!) {
    login (
      data: $data
    ) {
      token,
      user {
        id
        name
        password
      }
    }
  }
`;

const getProfile = gql`
  query {
    myInfo {
      id
      name
      email
    }
  }
`;

const getPosts = gql`
  query {
    getPosts {
      id
      title
      body
      published
    }
  }
`;

const myPosts = gql`
  query {
    getMyPosts {
      id
      title
      body
      published
    }
  }
`;

const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput) {
    updatePost (
      id: $id,
      data: $data
    ) {
      id
      title
      body
      published
    }
  }
`;

const createPost = gql`
  mutation($data: CreatePostInput) {
    createPost (
      data: $data
    ) {
      id
      title
      body
      published
    }
  }
`;

const deletePost = gql`
  mutation($id: ID!) {
    deletePost (
      id: $id
    ) {
      id
      title
      body
      published
    }
  }
`;

const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment (
      id: $id
    ) {
      id
      text
    }
  }
`;

export {
  createUser,
  getUsers,
  login,
  getProfile,
  getPosts,
  myPosts,
  updatePost,
  createPost,
  deletePost,
  deleteComment
}