const verifyPasswordLength = ({ password }) => {
  if (password && password.length < 8) {
    throw new Error('Password should be 8 characters or longer.')
  }
}

export { verifyPasswordLength as default }