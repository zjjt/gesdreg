import express from 'express';
import bodyParser from 'body-parser';
import {Meteor} from 'meteor/meteor';
import { createApolloServer } from 'meteor/apollo';
import {graphqlExpress,graphiqlExpress} from 'apollo-server-express';
import {makeExecutableSchema,addMockFunctionsToSchema} from 'graphql-tools';
import proxyMiddleware from 'http-proxy-middleware';
import schema from './schema.js';
import resolvers from './resolvers.js';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';


//export const GRAPHQL_PORT=5000;

//let graphQLServer=express();

const executableSchema=makeExecutableSchema({
  typeDefs:schema,
  resolvers:resolvers,
  allowUndefinedInResolve:false,
  printErrors:true
});

createApolloServer({
  schema:executableSchema
})
/*graphQLServer.use('*', cors({ origin: 'http://localhost:3000' }));
graphQLServer.use('/graphql',bodyParser.json(),graphqlExpress({
    schema:executableSchema,
}));
graphQLServer.use('/graphiql',graphiqlExpress({
  endpointURL:'/graphql',
  subscriptionsEndpoint: `ws://localhost:${GRAPHQL_PORT}/subscriptions`
}));
graphQLServer.use('/', (req, res) => res.redirect('/graphiql'));
//server websocket for subscriptions
// Wrap the Express server
const ws = createServer(graphQLServer);
ws.listen(GRAPHQL_PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${GRAPHQL_PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema:executableSchema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
//graphQLServer.listen(GRAPHQL_PORT);
WebApp.rawConnectHandlers.use(proxyMiddleware(`http://localhost:${GRAPHQL_PORT}/graphql`));
*/