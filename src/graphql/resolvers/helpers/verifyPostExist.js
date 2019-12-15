const verifyPostExist = async ({ id, prisma, checkPublished = false }) => {
    let postExist = await prisma.exists.Post({ id });

    if (checkPublished) {
      postExist = await prisma.exists.Post({ id, published: true })
    }

    if(!postExist){
      throw new Error('Unable to find post.');
    }
}

export {verifyPostExist as default}