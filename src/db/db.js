const Users = [
  {
    id: "1",
    name: "Daniel",
    email: "email1@email.com" ,
    posts: ['1', '2'],
    comments: ['1', '3']
  },
  {
    id: "2",
    name: "Alejando",
    email: "test@email.com",
    age: 23,
    posts: ['3'],
    comments: ['2']
  },
  {
    id: "3",
    name: "Andrew",
    email: "test121212@email.com",
    age: 29,
    posts: [],
    comments: ['4']
  }
]

const Posts = [
  {
    id: "1",
    title: "Music",
    body: "qereyuio",
    published: false,
    author: '1',
    comments: ['3']
  },
  {
    id: "2",
    title: "Playground",
    body: "aqwrsefdfdzh",
    published: true,
    author: '1',
    comments: ['1']
  },
  {
    id: "3",
    title: "Sports",
    body: "m,hnjhjg",
    published: true,
    author: '2',
    comments: ['2', '4']
  },
]

const Comments = [
  {
    id: "1",
    text: "dummyyyyyy data",
    author: "1",
    post: '2'
  },
  {
    id: "2",
    text: "This is a comment example",
    author: "2",
    post: '3'
  },
  {
    id: "3",
    text: "finish your grapghql course moron",
    author: "1",
    post: '1'
  },
  {
    id: "4",
    text: "then you can continue with the nodejs course",
    author: "3",
    post: '3'
  }
];

const db = {
  Users,
  Posts,
  Comments
}

export {db as default};