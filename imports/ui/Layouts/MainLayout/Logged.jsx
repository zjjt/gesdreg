import React,{PropTypes,Component} from 'react';
import store from '../../../redux/store';
import {userconnected} from '../../../redux/actions/user-actions.js';
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
import {createContainer} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {gql,graphql} from 'react-apollo';
import { client} from '../../../redux/rootReducer';
import {Session} from 'meteor/session';

 class Logged extends Component{
   componentDidUpdate(){
      
   }
    render(){
        
        console.dir("user loggs "+Meteor.userId());
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
        }else if(Meteor.userId()){
            
            const{data,dispatch}=this.props;
                 if(typeof data.user!=="undefined")
                {
                    store.dispatch(userconnected(data.user[0]));
                    Session.set("userRole",data.user[0].role);
                    Session.set("banque",data.user[0].prenoms);
                    Session.set("canshow",true);
                    console.log("contenu de data");
                    console.dir(data);

                    if(data.user[0].role==="B"){
                        return(
                        <IconMenu 
                        {...this.props}
                        iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                        targetOrigin={{horizontal:'right',vertical:'top'}}
                        anchorOrigin={{horizontal:'right',vertical:'top'}}
                        iconStyle={{color:'white'}}	
                        >
                            <MenuItem primaryText="Liste des règlements disponibles" onClick={()=>{FlowRouter.go('dispo')}}/>
                            <MenuItem primaryText="Déconnection" onClick={()=>{
                                Meteor.logout(()=>{
                                Session.keys={};
                                FlowRouter.go('home');
                            });
                            }}/>
                        </IconMenu>
                    
                        );
                    }
                     else if(data.user[0].role==="C"){
                     
                    return(
                    <IconMenu 
                    {...this.props}
                    iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                    targetOrigin={{horizontal:'right',vertical:'top'}}
                    anchorOrigin={{horizontal:'right',vertical:'top'}}
                    iconStyle={{color:'white'}}	
                    >
                        <MenuItem primaryText="Liste des règlements disponibles" onClick={()=>{FlowRouter.go('dispo')}}/>
                        <MenuItem primaryText="Exporter vers Excel" onClick={()=>{FlowRouter.go('excel')}}/>
                        <MenuItem primaryText="Déconnection" onClick={()=>{
                            Meteor.logout(()=>{
                            Session.keys={};
                            FlowRouter.go('home');
                            return client.resetStore();
                        });
                        }}/>
                    </IconMenu>
                
                    );
                }
                    else if(data.user[0].role==="G"){
                       
                         return(

                        <IconMenu 
                        {...this.props}
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
             else{
                 return(<div style={{textAlign:'center',color:'white'}}>...</div>);
             }
            
        }
    }
	
}



Logged.propTypes={
    data:PropTypes.shape({
        loading:PropTypes.bool,
       user:PropTypes.array
    }).isRequired,
    
     //date:PropTypes.instanceOf(date),  
};


const currentUser=gql`
    query currentUser($username:String){
        user(username:$username){
            username
            uncrypted
            nom
            prenoms
            fullname
            codeRedac
            role
            
        },
        
    }`;



export default graphql(currentUser,{
    options:() => ({ variables: {username:Meteor.userId()?Meteor.user().username:null},fetchPolicy: 'cache-first',}),
})(Logged);

