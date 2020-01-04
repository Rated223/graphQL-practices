import { verifyPasswordLength } from "../../src/graphql/resolvers/helpers";

const passwordToPass = "1q2w3e4r5t";
const passwordToFail = "1234";

test('Should pass if the password given is 8 or more characters', () => {
  verifyPasswordLength({ password: passwordToPass })
});

test('Should return error if a password is not given', () => {
  expect(() => { 
    verifyPasswordLength()
  }).toThrow();
});

test('Should return error if the password is less that 8 characters', () => {
  expect(() => {
    verifyPasswordLength({ password: passwordToFail });
  }).toThrow();
})