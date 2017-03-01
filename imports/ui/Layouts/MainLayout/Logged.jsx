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
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class Logged extends TrackerReact(Component){
    render(){
        console.dir("user loggs "+Meteor.user());
        if(store.getState().administrateurAction.adminConnected){
            return(

            <IconMenu 
            {...this.props}
            iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
            targetOrigin={{horizontal:'right',vertical:'top'}}
            anchorOrigin={{horizontal:'right',vertical:'top'}}
            iconStyle={{color:'white'}}	
            >
                <MenuItem primaryText="Créer un utilisateur" onClick={()=>{FlowRouter.go('createUser')}}/>
                <MenuItem primaryText="Modifier un utilisateur" onClick={()=>{FlowRouter.go('listUser')}}/>
                
                <MenuItem primaryText="Déconnection" onClick={()=>{
                    store.dispatch(deconnection)
                    window.location.reload();
                    
                    
                }}/>
            </IconMenu>
        
            );
        }else{
            
            if(Meteor.user()){
                let user=Meteor.user();
                    if(user.role==="C"){
                    return(

                    <IconMenu 
                    {...props}
                    iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                    targetOrigin={{horizontal:'right',vertical:'top'}}
                    anchorOrigin={{horizontal:'right',vertical:'top'}}
                    iconStyle={{color:'white'}}	
                    >
                        <MenuItem primaryText="Liste des règlements disponibles" onClick={()=>{FlowRouter.go('dispo')}}/>
                        <MenuItem primaryText="Déconnection" onClick={()=>Meteor.logout(()=>{
                            FlowRouter.go('home');
                        })}/>
                    </IconMenu>
                
                    );
                }
                else if(user.role==="G")
                {
                    return(

                    <IconMenu 
                    {...props}
                    iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                    targetOrigin={{horizontal:'right',vertical:'top'}}
                    anchorOrigin={{horizontal:'right',vertical:'top'}}
                    iconStyle={{color:'white'}}	
                    >
                        <MenuItem primaryText="Liste des règlements disponibles" onClick={()=>{FlowRouter.go('dispo')}}/>
                        <MenuItem primaryText="Modifier les règlements et leurs statuts" onClick={()=>{FlowRouter.go('dispolist')}}/>
                        <MenuItem primaryText="Exporter vers Excel" onClick={()=>{FlowRouter.go('excel')}}/>
                        <MenuItem primaryText="Déconnection" onClick={()=>Meteor.logout(()=>{
                            FlowRouter.go('home');
                        })}/>
                    </IconMenu>
                
                    );
                }
            }
            
        }
    }
	
}

