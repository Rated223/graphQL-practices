const verifyEmailTaken = async ({ email, prisma }) => {
  const emailTaken = await prisma.exists.User({ email });

    if (emailTaken) {
      throw new Error('This email already has an account.');
    }
}

export { verifyEmailTaken as default }