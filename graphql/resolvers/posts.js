const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    // Get All Post
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    // Get Post By Id
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    // Create Post
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      // Post Object
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      // context.pubsub.publish("NEW_POST", {
      //   newPost: post,
      // });
      return post;
    },

    // Delete Post
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        // Check Post owner
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post Deleted Successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    // Like on post
    async likePost(_, { postId }, context) {
      const user = checkAuth(context);
      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find((like) => like.username === user.username)) {
          // post already liked
          post.likes = post.likes.filter(
            (like) => like.username !== user.username
          );
        } else {
          // Not likes
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },

    // Subscription: {
    //   newPost: {
    //     subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    //   },
    // },
  },
};
