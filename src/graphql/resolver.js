import GMR from 'graphql-merge-resolvers';
import { extractFragmentReplacements } from 'prisma-binding';

import userResolver from './resolvers/user.resolver';
import postResolver from './resolvers/post.resolver';
import commentResolver from './resolvers/comment.resolver';


const resolvers = GMR.merge([
  userResolver,
  postResolver,
  commentResolver
]);

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };