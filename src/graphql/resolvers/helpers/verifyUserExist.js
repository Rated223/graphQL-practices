const verifyUserExist = async ({ prisma, id }) => {
    const userExist = await prisma.exists.User({ id });
    console.log("eoooooooooooooooooooooo",userExist);
    if (!userExist) {
      throw new Error('This user do not exist.');
    }
}

export { verifyUserExist as default }