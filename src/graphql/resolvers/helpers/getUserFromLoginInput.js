import bcrypt from 'bcryptjs';

const getUserFromLoginInput = async ({ email, password, prisma }) => {
  const user = await prisma.query.user({ where: { email } });

  if (!user) {
    throw new Error('Unable to login');
  }

  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) {
    throw new Error('Unable to login');
  }

  return user;
}

export { getUserFromLoginInput as default }