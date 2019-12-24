import jwt from 'jsonwebtoken';
import { generateToken } from '../../src/graphql/resolvers/helpers'

const id = 12;

test('Should return the user id from the token', () => {
  const token = generateToken({ id });
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  expect(userId).toBe(id);
});