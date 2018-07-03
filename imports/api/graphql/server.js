import express from 'express';
import bodyParser from 'body-parser';
import {Meteor} from 'meteor/meteor';
import {graphqlExpress,graphiqlExpress} from 'apollo-server-express';
import proxyMiddleware from 'http-proxy-middleware';
import schema from './schema.js';
import resolvers from './resolvers.js';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';
import { WebApp } from 'meteor/webapp'; // Meteor-specific
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createApolloServer, addCurrentUserToContext } from 'meteor/apollo'; // specific to Meteor, but you can always check out the Express implementation
import { makeExecutableSchema } from 'graphql-tools';
//export const GRAPHQL_PORT=5000;

//let graphQLServer=express();

const executableSchema=makeExecutableSchema({
  typeDefs:schema,
  resolvers:resolvers,
  allowUndefinedInResolve:false,
  printErrors:true
});

export const pubsub = new PubSub();
const context={}; 
const subscriptionsPath = '/subscriptions';

createApolloServer({
  schema:executableSchema,
  context
},{
  configServer: expressServer => expressServer.use(cors())
});

// create the subscription manager thanks to the schema & the pubsub mechanism

new SubscriptionServer(
  {
    schema:executableSchema,
    execute,
    subscribe,
    // on connect subscription lifecycle event
    /*onConnect: async (connectionParams, webSocket) => {
      // if a meteor login token is passed to the connection params from the client,
      // add the current user to the subscription context
      const subscriptionContext = connectionParams.meteorLoginToken
        ? await addCurrentUserToContext(context, connectionParams.meteorLoginToken)
        : context;

      return subscriptionContext;
    },*/
  },
  {
    // bind the subscription server to Meteor WebApp
    server: WebApp.httpServer,
    path: subscriptionsPath,
  }
);
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