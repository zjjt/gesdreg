import bodyParser from 'body-parser';
import {graphqlExpress,graphiqlExpress} from 'graphql-server-express';
import proxyMiddleware from 'http-proxy-middleware';
import schema from './schema';
import resolvers from './resolvers.js';
import express from 'express';
import cors from 'cors';
import { WebApp } from 'meteor/webapp'; // Meteor-specific
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from 'graphql-tools';
import { createServer } from 'http';
export const GRAPHQL_PORT=5000;

let graphQLServer=express();

const executableSchema=makeExecutableSchema({
  typeDefs:schema,
  resolvers:resolvers,
  allowUndefinedInResolve:false,
  printErrors:true
});



graphQLServer.use('*',cors());
graphQLServer.options('*', cors()) ;
graphQLServer.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
   // res.header("Access-Control-Allow-Origin","Origin, X-Requested-With, Accept");
    next();
});
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
  //console.log(Meteor.absoluteUrl())
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