const express = require('express');

// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');


const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
// const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;


//this is what starts the server and passes in the data!!!!!
const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    //REMEMBER!! THIS AUTH MIDDLEWARE ISH MESSES UP THE PLAYGROUND
    //RE-ENABLE IT WHEN USING AUTH FRONT END WITH TOKENS
    // context: authMiddleware 
  });

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};


//this starts it
startServer();


app.use(express.urlencoded({ extended: true}));
app.use(express.json());


// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

//THE APP.USE ROUTES WAS THE PROBLEM

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
