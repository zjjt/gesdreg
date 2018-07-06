import {Meteor} from 'meteor/mongo';
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import adminReducer from './reducers/admin-reducer';
import userReducer from './reducers/user-reducer';
import {createNetworkInterface,toIdValue} from 'react-apollo';
import ApolloClient from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';


const wsLink=window.location.origin.slice(0,-5);
//alert(wsLink);
const networkInterface=createNetworkInterface({ uri:
	wsLink+':5000/graphql' });

	networkInterface.use([{
		applyMiddleware(req, next) {
			setTimeout(next, 500);
		},
	}]);


// create a websocket client
const wsClient = new SubscriptionClient(wsLink.replace('http','ws')+`:5000/subscriptions`, {
  reconnect: true,
  // pass some extra information to the subscription, like the current user:
  /*connectionParams: {
    // getMeteorLoginToken = get the Meteor current user login token from local storage
    meteorLoginToken: getMeteorLoginToken(),
	},*/
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
	networkInterface,
	wsClient
  );

 

const client= new ApolloClient({
	networkInterface: networkInterfaceWithSubscriptions,
});

const reducers={
	apollo:client.reducer(),
	form:formReducer,
	administrateurAction:adminReducer,
	userActions:userReducer
};
const rootReducer=combineReducers(reducers);
export {client,rootReducer};