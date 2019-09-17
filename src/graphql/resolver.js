import userResolver from './resolvers/user.resolver';
import postResolver from './resolvers/post.resolver';
import commentResolver from './resolvers/comment.resolver';

const Subscription = {
  count: {
    subscribe(parents, args, ctx, info) {
      let count = 0;

      setInterval(() => {
        count++;
        ctx.pubsub.publish('count', {
          count
        });
      }, 1000);

      return ctx.pubsub.asyncIterator('count');
    }
  }
};

const testResolver = { Subscription };

import GMR from 'graphql-merge-resolvers';

const resolvers = GMR.merge([
  // testResolver,
  userResolver,
  postResolver,
  commentResolver
]);

export default resolvers;