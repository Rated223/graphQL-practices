import jwt from 'jsonwebtoken';

const getUserIdFromToken = ({ request, requiredAuth = true }) => {
  //check if the info came from a http request or a socket connection
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization;

  if (header) {
    const token = header.replace('Bearer ', '');
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    return tokenDecoded.userId;
  }

  if (requiredAuth) {
    throw new Error('Autherization required');
  }

  return null;
}

export { getUserIdFromToken as default}