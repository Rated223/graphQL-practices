const verifyAuthorOfComment = async ({ id, authorId, prisma }) => {
  const commentExist = await prisma.exists.Comment({ 
    id, 
    author: {
      id: authorId
    } 
  });

  if (!commentExist) {
    throw new Error('You cannot modify a comment of which you are not the author');
  }
}

export { verifyAuthorOfComment as default }