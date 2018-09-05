import {Meteor} from 'meteor/meteor';
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import adminReducer from './reducers/admin-reducer';
import userReducer from './reducers/user-reducer';
import {createNetworkInterface,toIdValue} from 'react-apollo';
import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

/*
const wsLink=window.location.origin.slice(0,-5);
let port=Meteor.settings.public.GRAPHQL_PORT?Meteor.settings.public.GRAPHQL_PORT:"5000"
const networkInterface=createNetworkInterface({ uri:
	wsLink+`:${port}/graphql`});

	networkInterface.use([{
		applyMiddleware(req, next) {
			setTimeout(next, 500);
		},
	}]);


// create a websocket client
const wsClient = new SubscriptionClient(wsLink.replace('http','ws')+`:${port}/subscriptions`, {
  reconnect: true,
  // pass some extra information to the subscription, like the current user:
  /*connectionParams: {
    // getMeteorLoginToken = get the Meteor current user login token from local storage
    meteorLoginToken: getMeteorLoginToken(),
	},*/
//});
/*
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
	networkInterface,
	wsClient
  );
*/
 
const networkInterface=createNetworkInterface({
	uri:'/graphql',
	credentials:'same-origin'//pour dire kils sont sur le meme domaine
});

const client= new ApolloClient(networkInterface);

const reducers={
	apollo:client.reducer(),
	form:formReducer,
	administrateurAction:adminReducer,
	userActions:userReducer
};
const rootReducer=combineReducers(reducers);
export {client,rootReducer};