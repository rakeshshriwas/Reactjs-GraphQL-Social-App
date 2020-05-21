const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

// Constent
const { MONGODB } = require("./config.js");

// TypeDefs
const typeDefs = require("./graphql/typeDefs.js");

// Resolvers
const resolvers = require("./graphql/resolvers");

// const pubsub = PubSub();

// Step 4 Create A Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

// Connect to mongoose
// Step 5 Start Server and connect to mongo db
mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server Running at ${res.url}`);
  });
