import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import adminReducer from './reducers/admin-reducer';
import userReducer from './reducers/user-reducer';
import {createNetworkInterface,toIdValue} from 'react-apollo';
import ApolloClient from 'apollo-client';
import { createMeteorNetworkInterface, meteorClientConfig } from 'meteor/apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { GRAPHQL_PORT} from '../api/graphql/server';


const networkInterface=createMeteorNetworkInterface({
	batchingInterface: true,
});


const wsClient= new SubscriptionClient(`ws://localhost:3000/subscriptions`,{
	reconnect: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
	networkInterface,
	wsClient
  );

  function dataIdFromObject (result) {
	if (result.__typename) {
	  if (result.id !== undefined) {
		return `${result.__typename}:${result.id}`;
	  }
	}
	return null;
  }

const client= new ApolloClient(meteorClientConfig({
	networkInterface: networkInterfaceWithSubscriptions,
  /*customResolvers: {
    Query: {
      channel: (_, args) => {
        return toIdValue(dataIdFromObject({ __typename: 'Channel', id: args['id'] }))
      },
    },
  },*/
  dataIdFromObject,
}));

const reducers={
	apollo:client.reducer(),
	form:formReducer,
	administrateurAction:adminReducer,
	userActions:userReducer
};
const rootReducer=combineReducers(reducers);
export {client,rootReducer};