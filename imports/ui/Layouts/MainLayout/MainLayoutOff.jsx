import React,{PropTypes,Component} from 'react';
import store from '../../../redux/store';
import {client} from '../../../redux/rootReducer.js';
import {ApolloProvider} from 'react-apollo';
import {FlowRouter} from 'meteor/kadira:flow-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {blue900} from 'material-ui/styles/colors';
import {Meteor} from 'meteor/meteor';
import {deconnection} from '../../../redux/actions/admin-actions.js';
import { createContainer } from 'meteor/react-meteor-data';
import Logged from './Logged.jsx';
import {$} from 'meteor/jquery';
import {Bert} from 'meteor/themeteorchef:bert'


//pour desactiver METEOR_OFFLINE_CATALOG=1 meteor
const muiTheme= getMuiTheme({
	appBar:{
		backgroundColor: blue900
	}
});
Bert.defaults = {
	hideDelay: 10000,
}
class Bienvenue extends Component{
	//static muiName='FlatButton';
	constructor(){
		super();
	}
	render(){
		return(
			<FlatButton {...this.props} 
				label="Bienvenue"  
				style={{
					color:'white',
					marginTop:'5%'
				}} />
		);
	}
}



//Logged.muiName='IconMenu';

export default class MainLayoutOff extends Component{
	constructor(){
		super();
		this.state={
			loggedIn:false,
		};
	}
	componentWillMount() {
		

	}

	componentDidMount() {	
		
		
		//setInterval(createDiv,1000);
	}
	componentDidUpdate(){
		
		if((store.getState().administrateurAction.adminConnected||Meteor.user()) && !this.state.loggedIn)
		{
			$('.appbar h1').attr("title","Gestion des disponibilités de règlements Nsia Vie Assurances");
			this.setState({
				loggedIn:true
			});
			
		}
	}
	componentDidMount(){
		if(Meteor.user()){
			this.setState({
				loggedIn:false
			});

		}
		
	}
	render(){
		
		const {content}=this.props;
		//{content()}
		//alert(Session.get("userRole"));
		
			return(
			<ApolloProvider store={store} client={client}>
				<MuiThemeProvider muiTheme={muiTheme}>
					<div className="masterContainer">
						<header>
							{store.getState().administrateurAction.adminConnected||Meteor.user()?(
								<AppBar
										title="GESDREG Nsia Vie Assurances"
										className="appbar"
										style={{backgroundColor:'#cd9a2e' }}
										onTitleTouchTap={()=>{FlowRouter.go('home')}}
										iconClassNameLeft="none"
										iconElementRight={store.getState().administrateurAction.adminConnected||Meteor.user()?<Logged/>:<Bienvenue/>}
								/>
							):""}
						
						</header>
						<section className="generalSection">
						{content()}
						</section>
						<footer>
							GESDREG v.1.5.0 &copy; Nsia Vie Assurances tous droits réservés. 
						</footer>
					</div>
				</MuiThemeProvider>	
			</ApolloProvider>
		);
	}
	

}

MainLayoutOff.propTypes={
	content:PropTypes.func.isRequired
};


