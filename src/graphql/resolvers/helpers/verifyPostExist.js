const verifyPostExist = async ({ id, prisma }) => {
    const postExist = await prisma.exists.Post({ id })
    if(!postExist){
      throw new Error('This post do not exist');
    }
}

export {verifyPostExist as default}