const verifyAuthorOfPost = async ({ id, authorId, prisma }) => {
  const postExist = await prisma.exists.Post({ 
    id, 
    author: {
      id: authorId
    } 
  });

  if (!postExist) {
    throw new Error('You cannot modify a post of which you are not the author');
  }
}

export { verifyAuthorOfPost as default }