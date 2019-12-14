const verifyTitleTaken = async ({ title, prisma }) => {
  const titleTaken = await prisma.exists.Post({ title })

  if (titleTaken){
    throw new Error("This title belongs to another post");
  }
}

export { verifyTitleTaken as default }