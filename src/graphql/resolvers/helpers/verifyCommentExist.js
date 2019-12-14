const verifyCommentExist = async ({ id, prisma }) => {
  const commentExist = await prisma.exists.Comment({ id })
  if(!commentExist){
    throw new Error('This comment do not exist');
  }
}

export { verifyCommentExist as default }